import { Button } from '../components/Button.jsx';
import { Card } from '../components/Card.jsx';

const features = [
  {
    title: 'Parcours structures',
    text: 'Organisez vos formations IA par objectifs, niveaux et formats pour rendre l’offre lisible.',
  },
  {
    title: 'Suivi centralise',
    text: 'Gardez les notes, contenus et prochaines actions dans un espace admin simple a maintenir.',
  },
  {
    title: 'Base prete a etendre',
    text: 'Authentification, donnees Supabase et interface admin sont deja poses pour accelerer le projet.',
  },
];

const stats = [
  { value: '3', label: 'modules prets' },
  { value: '24h', label: 'pour lancer un pilote' },
  { value: '1', label: 'espace de gestion' },
];

export default function PublicHome({ isAuthenticated }) {
  return (
    <main className="public-page">
      <header className="public-header">
        <a className="public-brand" href="/" aria-label="Formation IA">
          <span className="brand-mark" aria-hidden="true">
            F
          </span>
          <strong>Formation IA</strong>
        </a>

        <nav className="public-nav" aria-label="Navigation publique">
          <a href="#offre">Offre</a>
          <a href="#programme">Programme</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
      </header>

      <section className="public-hero">
        <div className="hero-copy">
          <p className="eyebrow">Formation IA pour equipes</p>
          <h1>Un parcours clair pour adopter l’IA sans complexifier le travail.</h1>
          <p>
            Une page publique prete a presenter l’offre, expliquer le programme et envoyer les
            administrateurs vers leur espace de gestion.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#offre">
              Voir l’offre
            </a>
            <a className="button button-secondary" href="/dashboard">
              {isAuthenticated ? 'Ouvrir le dashboard' : 'Acces admin'}
            </a>
          </div>
        </div>

        <Card className="hero-panel">
          <div className="section-heading">
            <h2>Plan de lancement</h2>
            <p>Une structure simple pour passer d’une intention a un premier atelier operationnel.</p>
          </div>
          <div className="timeline-list">
            <TimelineItem number="01" title="Cadrage" text="Objectifs, public cible et cas d’usage prioritaires." />
            <TimelineItem number="02" title="Atelier" text="Exercices guides, bonnes pratiques et limites a connaitre." />
            <TimelineItem number="03" title="Suivi" text="Notes, retours et prochaines actions dans l’espace admin." />
          </div>
        </Card>
      </section>

      <section className="public-stats" aria-label="Indicateurs">
        {stats.map((stat) => (
          <div className="stat-item" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="public-section" id="offre">
        <div className="section-heading">
          <p className="eyebrow">Offre</p>
          <h2>Une base publique lisible et connectee a l’admin.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <FeatureCard key={feature.title} title={feature.title} text={feature.text} />
          ))}
        </div>
      </section>

      <section className="public-section program-section" id="programme">
        <div>
          <p className="eyebrow">Programme</p>
          <h2>Un chemin court, oriente usage reel.</h2>
        </div>
        <div className="program-list">
          <ProgramRow title="Comprendre" text="Identifier ce que l’IA peut automatiser, assister ou ameliorer." />
          <ProgramRow title="Pratiquer" text="Construire des prompts utiles et des workflows reproductibles." />
          <ProgramRow title="Integrer" text="Definir les regles internes, les limites et les prochaines experimentations." />
        </div>
      </section>

      <section className="public-cta">
        <div>
          <p className="eyebrow">Administration</p>
          <h2>Le dashboard reste reserve a l’equipe connectee.</h2>
        </div>
        <Button className="link-button" onClick={() => window.location.assign('/dashboard')}>
          Acceder au dashboard
        </Button>
      </section>
    </main>
  );
}

function FeatureCard({ title, text }) {
  return (
    <Card className="feature-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </Card>
  );
}

function TimelineItem({ number, title, text }) {
  return (
    <div className="timeline-item">
      <span>{number}</span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function ProgramRow({ title, text }) {
  return (
    <div className="program-row">
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}
