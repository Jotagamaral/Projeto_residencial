alter table public."CSTB007_AVISO"
  add column if not exists "DT_INICIO" timestamp without time zone;

update public."CSTB007_AVISO"
set "DT_INICIO" = coalesce("DT_INICIO", now() at time zone 'utc')
where "DT_INICIO" is null;

alter table public."CSTB007_AVISO"
  alter column "DT_INICIO" set default (now() at time zone 'utc');
