CREATE TABLE snapshots (
    id integer DEFAULT nextval('snapshots_table_id_seq'::regclass) PRIMARY KEY,
    exchange_name text NOT NULL,
    total_price numeric,
    token_amount numeric NOT NULL,
    token_symbol character varying(5) NOT NULL,
    error_message text,
    is_sell boolean NOT NULL,
    timestamp bigint NOT NULL,
    batch_timestamp bigint NOT NULL
);