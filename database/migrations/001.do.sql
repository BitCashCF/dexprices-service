CREATE TABLE snapshots (
    id integer DEFAULT nextval('snapshots_table_id_seq'::regclass) PRIMARY KEY,
    "exchangeName" text NOT NULL,
    "totalPrice" numeric,
    "tokenAmount" numeric NOT NULL,
    "tokenSymbol" character varying(5) NOT NULL,
    "errorMessage" text,
    timestamp bigint NOT NULL,
    "batchTimestamp" bigint NOT NULL
);