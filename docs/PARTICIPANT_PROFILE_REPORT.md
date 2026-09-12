# Participant profile status in reports

The JSON and CSV endpoints `/admin/reports/participants` and
`/admin/reports/participants.csv` accept `profile_status`:

- `not_started`: no profile, or only a name (which registration can populate).
- `partial`: at least one of organization, biography, or photo exists, but one
  or more of the four profile fields is blank.
- `complete`: name, organization, biography, and photo are all nonblank.

Whitespace-only values are blank. These are reporting criteria, not new
required fields on the profile form. Status reflects current stored data;
it does not prove that the participant submitted the profile form themselves.

JSON rows include `profile_status` and `profile_missing_fields`. CSV includes
the same fields, with missing field names separated by commas. Filters apply
before pagination and to every exported package row. Accounts without a
profile are included; their `participant_id` is null and `user_id` identifies
the account. Existing event/package/payment filters still apply.

The frontend downloads CSV using the authenticated API client. Date filtering
retains its existing behavior: it applies only to packages on the displayed
page, not the server CSV export.

Deploy both the Nuxt frontend and `fastapi-event` backend changes. No database
migration is needed. An older backend without status data displays Unavailable.
