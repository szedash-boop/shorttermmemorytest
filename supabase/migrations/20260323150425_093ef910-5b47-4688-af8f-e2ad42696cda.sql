-- Drop all existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can delete results" ON public.participant_results;
DROP POLICY IF EXISTS "Anyone can update results" ON public.participant_results;
DROP POLICY IF EXISTS "Anyone can read results" ON public.participant_results;
DROP POLICY IF EXISTS "Anyone can insert results" ON public.participant_results;

-- INSERT: Allow anyone (participants submit without auth)
CREATE POLICY "Public can insert results"
ON public.participant_results
FOR INSERT
TO public
WITH CHECK (true);

-- SELECT: Only authenticated users (moderators)
CREATE POLICY "Authenticated users can read results"
ON public.participant_results
FOR SELECT
TO authenticated
USING (true);

-- UPDATE: Only authenticated users (moderators and in-progress saves via edge function)
CREATE POLICY "Authenticated users can update results"
ON public.participant_results
FOR UPDATE
TO authenticated
USING (true);

-- DELETE: Only authenticated users (moderators)
CREATE POLICY "Authenticated users can delete results"
ON public.participant_results
FOR DELETE
TO authenticated
USING (true);