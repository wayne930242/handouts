ALTER TABLE public.game_docs
DROP CONSTRAINT game_docs_pkey;

ALTER TABLE public.game_docs
ADD COLUMN id BIGSERIAL PRIMARY KEY;

CREATE UNIQUE INDEX idx_game_docs_game_id_doc_id ON public.game_docs (game_id, doc_id);

COMMENT ON TABLE public.game_docs IS 'This table allows multiple associations between games and docs. The unique index on (game_id, doc_id) prevents exact duplicates but allows multiple different associations.';