drop policy if exists "Anyone can submit a lead" on public.leads;

create policy "Anyone can submit a valid lead"
on public.leads
for insert
to anon, authenticated
with check (
  char_length(trim(name)) between 1 and 120
  and char_length(email) between 3 and 254
  and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  and (phone is null or char_length(phone) <= 30)
  and (source is null or char_length(source) <= 60)
);