/*
  # Adicionar View para Perfis com Email

  1. Nova View
    - `profiles_with_email` - View que combina profiles com emails do auth.users
  
  2. Segurança
    - Apenas usuários autenticados podem acessar
*/

-- Criar view para combinar profiles com email
CREATE OR REPLACE VIEW profiles_with_email AS
SELECT 
  p.id,
  p.name,
  p.avatar,
  p.role,
  p.online,
  p.warned,
  p.can_post,
  p.created_at,
  p.updated_at,
  au.email
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id;

-- Permitir leitura da view para usuários autenticados
GRANT SELECT ON profiles_with_email TO authenticated;
