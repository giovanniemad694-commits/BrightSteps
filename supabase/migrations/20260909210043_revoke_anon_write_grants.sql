/*
# Revoke write grants from anon role

The anon role had INSERT/UPDATE/DELETE grants on all three tables
(inherited from default Supabase table creation). While RLS policies
block unauthenticated writes, revoking these grants adds defense in depth.

## Changes
- REVOKE INSERT, UPDATE, DELETE on patriarchs FROM anon
- REVOKE INSERT, UPDATE, DELETE on patriarch_events FROM anon
- REVOKE INSERT, UPDATE, DELETE on patriarch_sources FROM anon
*/

REVOKE INSERT, UPDATE, DELETE ON patriarchs FROM anon;
REVOKE INSERT, UPDATE, DELETE ON patriarch_events FROM anon;
REVOKE INSERT, UPDATE, DELETE ON patriarch_sources FROM anon;
