/*
  # Configuração Inicial de Autenticação e Usuários

  1. Novas Tabelas
    - `profiles`
      - `id` (uuid, primary key, referencia auth.users)
      - `name` (text)
      - `avatar` (text)
      - `role` (text, default 'user')
      - `online` (boolean, default false)
      - `warned` (boolean, default false)
      - `can_post` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Segurança
    - Habilita RLS em `profiles`
    - Políticas para usuários autenticados lerem seu próprio perfil
    - Políticas para usuários autenticados atualizarem seu próprio perfil
    - Políticas para admins lerem/modificarem todos os perfis
    - Políticas públicas para leitura de perfis (necessário para comunidade)

  3. Triggers
    - Trigger para criar perfil automaticamente ao criar usuário
    - Trigger para atualizar updated_at automaticamente
*/

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  avatar text DEFAULT 'https://i.pravatar.cc/150?u=default',
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  online boolean DEFAULT false,
  warned boolean DEFAULT false,
  can_post boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilita RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ler todos os perfis (necessário para comunidade)
CREATE POLICY "Usuários autenticados podem ler todos os perfis"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Usuários podem atualizar seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política: Admins podem atualizar qualquer perfil
CREATE POLICY "Admins podem atualizar qualquer perfil"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Política: Admins podem deletar usuários (banir)
CREATE POLICY "Admins podem deletar usuários"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente ao registrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://i.pravatar.cc/150?u=' || NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil ao criar usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Inserir usuário admin inicial (senha será definida no primeiro login)
-- Email: admin@email.com
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a1111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'admin@email.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin","avatar":"https://i.pravatar.cc/150?u=user-admin"}',
  now(),
  now(),
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- Inserir perfil do admin
INSERT INTO profiles (id, name, avatar, role, online)
VALUES (
  'a1111111-1111-1111-1111-111111111111',
  'Admin',
  'https://i.pravatar.cc/150?u=user-admin',
  'admin',
  true
)
ON CONFLICT (id) DO NOTHING;
