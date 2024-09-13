-- Step 1: Remove the existing primary key constraint (if it exists)
ALTER TABLE public.game_docs
DROP CONSTRAINT IF EXISTS game_docs_pkey;

-- Step 2: Remove the id column
ALTER TABLE public.game_docs
DROP COLUMN IF EXISTS id;

-- Step 3: Add a new primary key constraint using game_id and doc_id
ALTER TABLE public.game_docs
ADD PRIMARY KEY (game_id, doc_id);

-- Step 4: Add a comment to explain the table's purpose
COMMENT ON TABLE public.game_docs IS 'This table associates games with docs. It allows multiple associations between games and docs.';

-- Step 5: Ensure foreign key constraints are in place
ALTER TABLE public.game_docs
DROP CONSTRAINT IF EXISTS game_docs_game_id_fkey,
ADD CONSTRAINT game_docs_game_id_fkey 
    FOREIGN KEY (game_id) 
    REFERENCES public.games(id) 
    ON DELETE CASCADE;

ALTER TABLE public.game_docs
DROP CONSTRAINT IF EXISTS game_docs_doc_id_fkey,
ADD CONSTRAINT game_docs_doc_id_fkey 
    FOREIGN KEY (doc_id) 
    REFERENCES public.docs(id) 
    ON DELETE CASCADE;