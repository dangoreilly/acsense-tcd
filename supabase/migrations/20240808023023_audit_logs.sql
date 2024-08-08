create table  IF NOT EXISTS 
  public.logs (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    "user" text null,
    action text null,
    subject text null,
    data json null,
    constraint logs_pkey primary key (id)
  ) tablespace pg_default;