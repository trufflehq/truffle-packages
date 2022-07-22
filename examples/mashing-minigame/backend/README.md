# Mashing Function Backend

This Supabase Edge function is used to manage time based rounds. Here are the [Supabase docs](https://supabase.com/docs/guides/functions) for info on how to get setup as well as running the function locally.

The way we handle that is proxying actions through truffle using the Events API to communicate events while leveraging the built-in auth, roles, and permissioning system inside of Truffle.

Functionality-wise, this function handles both updates to the round config from Truffle admins and counter increments from all of the
round participants.
