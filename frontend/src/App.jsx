import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/issues";

const steps = [
  {
    number: "01",
    icon: "◎",
    title: "Spot an issue",
    description:
      "Notice something that needs attention in your neighbourhood? CivicFix gives you a place to start.",
  },
  {
    number: "02",
    icon: "↗",
    title: "Report it simply",
    description:
      "Share the details, choose a category and add the location so the issue is easier to understand.",
  },
  {
    number: "03",
    icon: "✓",
    title: "Follow the progress",
    description:
      "Check the status as your report moves through review, action and resolution.",
  },
];

function App() {
  const [issues, setIssues] = useState([]);
  const [isLoadingIssues, setIsLoadingIssues] = useState(true);
  const [issueError, setIssueError] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "Roads & transport",
    location: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadIssues() {
    setIsLoadingIssues(true);
    setIssueError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The issues API returned an unexpected response.");
      }

      setIssues(data);
    } catch (error) {
      console.error("CivicFix could not load issues:", error);
      setIssueError(
        "We couldn't load community reports. Check that the backend is running, then try again.",
      );
    } finally {
      setIsLoadingIssues(false);
    }
  }

  useEffect(() => {
    loadIssues();
  }, []);

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setMessage("");
    setMessageType("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage("Submitting your report...");
    setMessageType("info");

    const payload = {
      title: form.title.trim(),
      category: form.category,
      location: form.location.trim(),
      description: form.description.trim(),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Request failed with status ${response.status}`,
        );
      }

      let savedIssue = null;
      const responseText = await response.text();

      if (responseText) {
        try {
          savedIssue = JSON.parse(responseText);
        } catch {
          savedIssue = null;
        }
      }

      const issueId = savedIssue?.id ?? savedIssue?.issueId ?? "";

      setMessage(
        issueId
          ? `Your issue was submitted successfully. Reference: CF-${issueId}.`
          : "Your issue was submitted successfully.",
      );
      setMessageType("success");

      setForm({
        title: "",
        category: "Roads & transport",
        location: "",
        description: "",
      });

      await loadIssues();
    } catch (error) {
      console.error("CivicFix report submission failed:", error);

      setMessage(
        "We couldn't submit your report. Check that the backend is running at localhost:8080, then try again.",
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderIssue(issue) {
    const statusKey = String(issue.status || "REPORTED").toUpperCase();

    const statusLabels = {
      REPORTED: "Reported",
      UNDER_REVIEW: "Under review",
      IN_PROGRESS: "In progress",
      RESOLVED: "Resolved",
      REOPENED: "Reopened",
    };

    const statusClasses = {
      REPORTED: "review",
      UNDER_REVIEW: "review",
      IN_PROGRESS: "progress",
      RESOLVED: "resolved",
      REOPENED: "progress",
    };

    const category = issue.category || "Other";
    const categoryLower = category.toLowerCase();

    const tone = categoryLower.includes("road")
      ? "orange"
      : categoryLower.includes("waste") || categoryLower.includes("public")
        ? "green"
        : "blue";

    const createdDate = issue.createdAt
      ? new Date(issue.createdAt).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Date unavailable";

    return (
      <article className="issue-card" key={issue.id}>
        <div className={`issue-illustration ${tone}`}>
          <span className="issue-art-symbol" aria-hidden="true">
            {statusKey === "RESOLVED" ? "✓" : "↗"}
          </span>
          <span className="issue-category">{category}</span>
          <span className="issue-id">CF-{issue.id}</span>
        </div>

        <div className="issue-content">
          <div className="issue-location">
            <span aria-hidden="true">⌖</span>{" "}
            {issue.location || "Location not provided"}
          </div>

          <h3>{issue.title || "Untitled issue"}</h3>

          <div className="issue-meta">
            <span
              className={`status-pill ${statusClasses[statusKey] || "review"}`}
            >
              <span />
              {statusLabels[statusKey] || statusKey.replaceAll("_", " ")}
            </span>

            <span className="issue-date">{createdDate}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#home" aria-label="CivicFix home">
          <span className="brand-mark">
            c<span>+</span>
          </span>
          <span className="brand-name">
            civicfix<span>.</span>
          </span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#community">Community</a>
          <a href="#impact">Our impact</a>
        </nav>

        <div className="header-actions">
          <a className="login-link" href="#login">
            Login
          </a>
          <a className="button button-small" href="#report">
            Report an issue <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <main>
        <section
          className="section-wrap"
          id="login"
          style={{ paddingTop: "100px", paddingBottom: "100px" }}
        >
          <div className="report-form">
            <div className="form-heading">
              <span className="form-icon">🔐</span>
              <div>
                <h3>Welcome back to CivicFix</h3>
                <p>Login to continue making your community better.</p>
              </div>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                alert(
                  "Login is not connected yet. We will implement authentication next.",
                );
              }}
            >
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                required
              />

              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                required
              />

              <button className="button form-submit" type="submit">
                Login
              </button>

              <p className="form-footnote">
                Authentication is not implemented yet. This form is currently a
                preview.
              </p>
            </form>
          </div>
        </section>

        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="live-dot" />
              BETTER NEIGHBOURHOODS START HERE
            </div>

            <h1>
              See something
              <br />
              that needs <span>fixing?</span>
            </h1>

            <p className="hero-description">
              Your neighbourhood deserves better. Report local issues, follow
              every update and help make your community a better place to live.
            </p>

            <div className="hero-actions">
              <a className="button" href="#report">
                Report an issue <span aria-hidden="true">↗</span>
              </a>
              <a className="text-link" href="#community">
                Explore community <span aria-hidden="true">↓</span>
              </a>
            </div>

            <div className="hero-trust">
              <div className="avatar-stack" aria-hidden="true">
                <span>A</span>
                <span>S</span>
                <span>R</span>
                <span>+</span>
              </div>

              <p>
                <strong>Small reports. Real change.</strong>
                <br />
                Every neighbourhood can be better.
              </p>
            </div>
          </div>

          <div
            className="hero-visual"
            aria-label="Illustration of a greener neighbourhood"
          >
            <div className="visual-topline">
              <span>
                <span className="live-dot" /> COMMUNITY SNAPSHOT
              </span>
              <span className="snapshot-date">YOUR NEIGHBOURHOOD</span>
            </div>

            <div className="neighbourhood-art">
              <div className="sun" />
              <div className="cloud cloud-one" />
              <div className="cloud cloud-two" />
              <div className="hill hill-back" />
              <div className="hill hill-front" />

              <div className="building building-one">
                <span className="building-window" />
                <span className="building-window" />
                <span className="building-window" />
                <span className="building-window" />
              </div>

              <div className="building building-two">
                <span className="building-window" />
                <span className="building-window" />
                <span className="building-window" />
                <span className="building-window" />
              </div>

              <div className="building building-three">
                <span className="building-window" />
                <span className="building-window" />
                <span className="building-window" />
                <span className="building-window" />
              </div>

              <div className="road" />
              <div className="road-line" />

              <div className="map-pin pin-one">
                <span>✓</span>
              </div>
              <div className="map-pin pin-two">
                <span>↗</span>
              </div>
              <div className="map-pin pin-three">
                <span>+</span>
              </div>

              <div className="floating-card">
                <span className="floating-icon">✓</span>
                <div>
                  <strong>Progress you can see</strong>
                  <p>Every report has a story.</p>
                </div>
              </div>
            </div>

            <div className="visual-footer">
              <div>
                <span className="visual-stat-number">One community</span>
                <span className="visual-stat-label">
                  Many ways to make a difference
                </span>
              </div>
              <span className="visual-footer-icon">↗</span>
            </div>
          </div>
        </section>

        <section className="trust-strip" id="impact">
          <div className="section-wrap trust-inner">
            <p>BUILT AROUND WHAT MATTERS</p>
            <div>
              <span>◎</span> Easy reporting
            </div>
            <div>
              <span>◷</span> Transparent updates
            </div>
            <div>
              <span>⌖</span> Local action
            </div>
            <div>
              <span>♡</span> Stronger communities
            </div>
          </div>
        </section>

        <section className="section-wrap community-section" id="community">
          <div className="section-heading">
            <div>
              <div className="eyebrow">YOUR COMMUNITY, IN VIEW</div>
              <h2>
                Change is already
                <br />
                taking <span>shape.</span>
              </h2>
            </div>

            <div className="section-heading-side">
              <p>
                Every reported issue is a chance to make daily life a little
                better. See the latest reports submitted by your community.
              </p>
              <a className="text-link" href="#report">
                Be part of it <span>↗</span>
              </a>
            </div>
          </div>

          {isLoadingIssues && (
            <p className="demo-note" role="status">
              Loading community reports…
            </p>
          )}

          {issueError && (
            <p className="demo-note error" role="alert">
              {issueError}{" "}
              <button className="text-link" type="button" onClick={loadIssues}>
                Try again
              </button>
            </p>
          )}

          {!isLoadingIssues && !issueError && issues.length === 0 && (
            <p className="demo-note">
              No community reports yet. Be the first to report an issue.
            </p>
          )}

          {!issueError && issues.length > 0 && (
            <div className="issue-grid">{issues.map(renderIssue)}</div>
          )}
        </section>

        <section className="how-section" id="how-it-works">
          <div className="section-wrap">
            <div className="center-heading">
              <div className="eyebrow">NO COMPLEXITY. JUST PROGRESS.</div>
              <h2>
                Making a difference
                <br />
                should feel <span>simple.</span>
              </h2>
              <p>
                From the first report to the final update, know where things
                stand.
              </p>
            </div>

            <div className="steps-grid">
              {steps.map((step) => (
                <article className="step-card" key={step.number}>
                  <div className="step-top">
                    <span className="step-number">{step.number}</span>
                    <span className="step-icon">{step.icon}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="report-section section-wrap" id="report">
          <div className="report-intro">
            <div className="eyebrow">YOUR VOICE, YOUR NEIGHBOURHOOD</div>
            <h2>
              Every improvement
              <br />
              starts with <span>one report.</span>
            </h2>
            <p>
              Tell us what needs attention. Submit a report and connect your
              neighbourhood feedback to the CivicFix backend.
            </p>

            <div className="report-promise">
              <span>✓</span> Easy reporting
              <span>✓</span> Community-first design
            </div>
          </div>

          <form className="report-form" onSubmit={handleSubmit}>
            <div className="form-heading">
              <span className="form-icon">↗</span>
              <div>
                <h3>Report a local issue</h3>
                <p>Share a few details to get started.</p>
              </div>
            </div>

            <label htmlFor="title">Issue title</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={updateForm}
              placeholder="e.g. Pothole near the bus stop"
              maxLength={150}
              required
            />

            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={updateForm}
              required
            >
              <option>Roads &amp; transport</option>
              <option>Waste management</option>
              <option>Street lighting</option>
              <option>Water &amp; drainage</option>
              <option>Public spaces</option>
              <option>Other</option>
            </select>

            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={updateForm}
              placeholder="Area, street or landmark"
              maxLength={200}
              required
            />

            <label htmlFor="description">
              What's happening? <span>(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={updateForm}
              placeholder="Add details that could help someone understand the issue..."
              rows={3}
              maxLength={2000}
            />

            <button
              className="button form-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit issue"}
              <span aria-hidden="true">{isSubmitting ? "…" : "↗"}</span>
            </button>

            {message && (
              <p
                className={`form-message ${messageType}`}
                role="status"
                aria-live="polite"
              >
                {message}
              </p>
            )}

            <p className="form-footnote">
              Your report will be sent to the local CivicFix API. Real
              authentication and user accounts are not implemented yet.
            </p>
          </form>
        </section>

        <section className="closing-cta">
          <div className="section-wrap closing-inner">
            <div>
              <div className="eyebrow">BETTER IS BUILT TOGETHER</div>
              <h2>
                A little action.
                <br />A lot of <span>possibility.</span>
              </h2>
            </div>
            <a className="button button-light" href="#report">
              Start with a report <span>↗</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-wrap footer-inner">
          <a className="brand footer-brand" href="#home">
            <span className="brand-mark">
              c<span>+</span>
            </span>
            <span className="brand-name">
              civicfix<span>.</span>
            </span>
          </a>

          <p>Small reports. Real change. Stronger communities.</p>

          <a href="#home" className="back-top">
            Back to top ↑
          </a>

          <div className="footer-bottom">
            <span>© 2026 CivicFix</span>
            <span>Designed for people who care about their neighbourhood.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
