CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  nom_complet VARCHAR(255) NOT NULL,
  cin VARCHAR(50) NOT NULL UNIQUE,
  num_permis VARCHAR(50),
  telephone VARCHAR(30) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  adresse TEXT,
  profile_photo_data TEXT,
  profile_photo_name VARCHAR(255),
  profile_photo_mime_type VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  is_email_validated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo_data TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_photo_mime_type VARCHAR(100);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id BIGSERIAL PRIMARY KEY,
  token VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id BIGSERIAL PRIMARY KEY,
  token VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS driving_licenses (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  license_number VARCHAR(50) NOT NULL,
  expiry_date DATE,
  front_document_data TEXT,
  front_document_name VARCHAR(255),
  front_document_mime_type VARCHAR(100),
  back_document_data TEXT,
  back_document_name VARCHAR(255),
  back_document_mime_type VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agences (
  id BIGSERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  adresse TEXT NOT NULL,
  ville VARCHAR(120) NOT NULL,
  telephone VARCHAR(30),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS marques (
  id BIGSERIAL PRIMARY KEY,
  nom VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS modeles (
  id BIGSERIAL PRIMARY KEY,
  marque_id BIGINT NOT NULL REFERENCES marques(id) ON DELETE RESTRICT,
  nom VARCHAR(120) NOT NULL,
  UNIQUE (marque_id, nom)
);

CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  nom VARCHAR(120) NOT NULL UNIQUE,
  tarif_jour_base NUMERIC(10, 2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS vehicules (
  id BIGSERIAL PRIMARY KEY,
  modele_id BIGINT NOT NULL REFERENCES modeles(id) ON DELETE RESTRICT,
  categorie_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  agence_id BIGINT NOT NULL REFERENCES agences(id) ON DELETE RESTRICT,
  immatriculation VARCHAR(50) NOT NULL UNIQUE,
  date_mise_en_circulation DATE,
  kilometrage INTEGER NOT NULL DEFAULT 0,
  carburant VARCHAR(50),
  etat VARCHAR(50) NOT NULL DEFAULT 'disponible',
  valeur_achat NUMERIC(12, 2),
  photo_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservations (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL DEFAULT 'standard',
  client_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  grille VARCHAR(120),
  statut VARCHAR(50) NOT NULL DEFAULT 'en_attente',
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  montant_jours NUMERIC(10, 2) NOT NULL DEFAULT 0,
  montant_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS locations (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  vehicule_id BIGINT NOT NULL REFERENCES vehicules(id) ON DELETE RESTRICT,
  reservation_id BIGINT REFERENCES reservations(id) ON DELETE SET NULL,
  date_debut TIMESTAMP NOT NULL,
  date_fin_prevue TIMESTAMP NOT NULL,
  date_retour_reelle TIMESTAMP,
  montant_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  agence_depart_id BIGINT REFERENCES agences(id) ON DELETE SET NULL,
  agence_retour_id BIGINT REFERENCES agences(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS factures (
  id BIGSERIAL PRIMARY KEY,
  location_id BIGINT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  numero VARCHAR(120) NOT NULL UNIQUE,
  montant_ht NUMERIC(10, 2) NOT NULL DEFAULT 0,
  tva NUMERIC(10, 2) NOT NULL DEFAULT 0,
  montant_ttc NUMERIC(10, 2) NOT NULL DEFAULT 0,
  date_emission TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  statut VARCHAR(50) NOT NULL DEFAULT 'brouillon'
);

CREATE TABLE IF NOT EXISTS paiements (
  id BIGSERIAL PRIMARY KEY,
  facture_id BIGINT NOT NULL REFERENCES factures(id) ON DELETE CASCADE,
  montant NUMERIC(10, 2) NOT NULL,
  methode VARCHAR(50) NOT NULL,
  date_paiement TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reference VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS comptes_tresorerie (
  id BIGSERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  solde_actuel NUMERIC(12, 2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS transferts (
  id BIGSERIAL PRIMARY KEY,
  vehicule_id BIGINT NOT NULL REFERENCES vehicules(id) ON DELETE CASCADE,
  agence_source_id BIGINT NOT NULL REFERENCES agences(id) ON DELETE RESTRICT,
  agence_destination_id BIGINT NOT NULL REFERENCES agences(id) ON DELETE RESTRICT,
  date_depart TIMESTAMP NOT NULL,
  date_arrivee_prevue TIMESTAMP,
  date_arrivee_reelle TIMESTAMP,
  etat VARCHAR(50) NOT NULL DEFAULT 'planifie'
);

CREATE TABLE IF NOT EXISTS review (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reservation_id BIGINT NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  contenu TEXT NOT NULL,
  note NUMERIC(3, 2) NOT NULL CHECK (note >= 0 AND note <= 5),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  vehicule_id BIGINT REFERENCES vehicules(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(50) PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  user_role VARCHAR(50) NOT NULL DEFAULT 'CLIENT',
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  message TEXT NOT NULL,
  reference_id VARCHAR(120),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reservations_client_id ON reservations(client_id);
CREATE INDEX IF NOT EXISTS idx_locations_client_id ON locations(client_id);
CREATE INDEX IF NOT EXISTS idx_locations_vehicule_id ON locations(vehicule_id);
CREATE INDEX IF NOT EXISTS idx_factures_location_id ON factures(location_id);
CREATE INDEX IF NOT EXISTS idx_paiements_facture_id ON paiements(facture_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_review_client_id ON review(client_id);
