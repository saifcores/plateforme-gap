CREATE TABLE journal_acces_document (
    id              BIGSERIAL PRIMARY KEY,
    document_id     BIGINT NOT NULL REFERENCES document(id) ON DELETE CASCADE,
    utilisateur_id  BIGINT REFERENCES utilisateur(id) ON DELETE SET NULL,
    email           VARCHAR(150),
    action          VARCHAR(20) NOT NULL DEFAULT 'DOWNLOAD',
    accede_le       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_journal_acces_document_le ON journal_acces_document (accede_le DESC);
