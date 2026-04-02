-- Documents table for storing generated compliance documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  ai_system_id UUID NOT NULL REFERENCES ai_systems(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('technical_documentation', 'risk_management_plan', 'transparency_notice')),
  title TEXT NOT NULL,
  content JSONB NOT NULL, -- Stores the sections array
  version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_documents_org_id ON documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_documents_ai_system_id ON documents(ai_system_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only access documents from their organization
CREATE POLICY "Users can view own organization documents"
  ON documents FOR SELECT
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can insert own organization documents"
  ON documents FOR INSERT
  WITH CHECK (organization_id = get_user_organization_id());

CREATE POLICY "Users can update own organization documents"
  ON documents FOR UPDATE
  USING (organization_id = get_user_organization_id());

CREATE POLICY "Users can delete own organization documents"
  ON documents FOR DELETE
  USING (organization_id = get_user_organization_id());

-- Trigger to update updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
