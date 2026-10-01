CREATE TABLE reels (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date_added DATE NOT NULL DEFAULT CURRENT_DATE,
  -- your remaining columns here, one per line
  subject TEXT NOT NULL
);