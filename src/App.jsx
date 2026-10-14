import { useEffect, useState } from "react";
import "./App.css";
import initialCategories from "./data/dashboardData.json";

const availableWidgets = initialCategories.flatMap(
  (category) => category.widgets,
);
function App() {
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem("accuknox-dashboard");
      return saved ? JSON.parse(saved) : initialCategories;
    } catch {
      return initialCategories;
    }
  });

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("cspm");
  const [widgetName, setWidgetName] = useState("");
  const [widgetText, setWidgetText] = useState("");

  useEffect(() => {
    localStorage.setItem("accuknox-dashboard", JSON.stringify(categories));
  }, [categories]);

  const filteredCategories = categories.map((category) => ({
    ...category,
    widgets: category.widgets.filter((widget) =>
      `${widget.name} ${widget.text}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    ),
  }));

  function addWidget(event) {
    event.preventDefault();

    if (!widgetName.trim() || !widgetText.trim()) return;

    const newWidget = {
      id: crypto.randomUUID(),
      name: widgetName.trim(),
      text: widgetText.trim(),
      type: "custom",
    };

    setCategories((current) =>
      current.map((category) =>
        category.id === activeCategory
          ? {
              ...category,
              widgets: [...category.widgets, newWidget],
            }
          : category,
      ),
    );

    setWidgetName("");
    setWidgetText("");
    setShowModal(false);
  }

  function removeWidget(categoryId, widgetId) {
    setCategories((current) =>
      current.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              widgets: category.widgets.filter(
                (widget) => widget.id !== widgetId,
              ),
            }
          : category,
      ),
    );
  }

  function resetDashboard() {
    setCategories(initialCategories);
    localStorage.removeItem("accuknox-dashboard");
    setSearch("");
  }

  function toggleCatalogWidget(widget, isChecked) {
    setCategories((current) =>
      current.map((category) => {
        if (category.id !== activeCategory) {
          return category;
        }

        const alreadyExists = category.widgets.some(
          (item) => item.id === widget.id,
        );

        if (isChecked && !alreadyExists) {
          return {
            ...category,
            widgets: [...category.widgets, { ...widget }],
          };
        }

        if (!isChecked) {
          return {
            ...category,
            widgets: category.widgets.filter((item) => item.id !== widget.id),
          };
        }

        return category;
      }),
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">A</span>
          <span>AccuKnox</span>
        </div>

        <div className="breadcrumb">
          Home <span>/</span> <strong>Dashboard</strong>
        </div>

        <div className="topbar-right">
          <span className="user-avatar">E</span>
          <span>Admin</span>
        </div>
      </header>

      <main className="main-content">
        <section className="toolbar">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>CNAPP Dashboard</h1>
            <p className="subtitle">
              Monitor your cloud security posture in one place.
            </p>
          </div>

          <div className="toolbar-actions">
            <label className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Search widgets..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </label>

            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              + Add Widget
            </button>

            <button
              className="btn btn-secondary"
              onClick={resetDashboard}
              title="Restore the initial dashboard"
            >
              Reset
            </button>
          </div>
        </section>

        <div className="dashboard-info">
          <span>Security Dashboard</span>
          <span className="status">
            <span className="status-dot" />
            All systems monitored
          </span>
        </div>

        <div className="dashboard-sections">
          {filteredCategories.map((category) => (
            <section className="category" key={category.id}>
              <div className="category-heading">
                <div>
                  <span className="category-mark" />
                  <h2>{category.name}</h2>
                  <span className="widget-count">
                    {category.widgets.length}
                  </span>
                </div>

                <button
                  className="add-category-widget"
                  onClick={() => {
                    setActiveCategory(category.id);
                    setShowModal(true);
                  }}
                >
                  + Add Widget
                </button>
              </div>

              <div className="widget-grid">
                {category.widgets.map((widget) => (
                  <article className="widget-card" key={widget.id}>
                    <div className="widget-heading">
                      <h3>{widget.name}</h3>
                      <button
                        className="remove-btn"
                        onClick={() => removeWidget(category.id, widget.id)}
                        title={`Remove ${widget.name}`}
                        aria-label={`Remove ${widget.name}`}
                      >
                        ×
                      </button>
                    </div>

                    <div className="widget-body">
                      {widget.type === "accounts" && (
                        <div className="chart-row">
                          <div className="donut donut-blue">
                            <div className="donut-center">
                              <strong>2</strong>
                              <span>Accounts</span>
                            </div>
                          </div>
                          <div className="chart-legend">
                            <span>
                              <i className="blue-dot" />
                              Connected (2)
                            </span>
                            <span>
                              <i className="light-blue-dot" />
                              Not Connected (0)
                            </span>
                          </div>
                        </div>
                      )}

                      {widget.type === "risk" && (
                        <div className="chart-row">
                          <div className="donut donut-green">
                            <div className="donut-center">
                              <strong>9659</strong>
                              <span>Total Checks</span>
                            </div>
                          </div>
                          <div className="chart-legend">
                            <span>
                              <i className="red-dot" /> Failed (689)
                            </span>
                            <span>
                              <i className="yellow-dot" /> Warning (196)
                            </span>
                            <span>
                              <i className="green-dot" /> Passed (8774)
                            </span>
                          </div>
                        </div>
                      )}

                      {widget.type === "empty" && (
                        <div className="empty-state">
                          <span className="empty-icon">▥</span>
                          <p>{widget.text}</p>
                        </div>
                      )}

                      {widget.type === "bar" && (
                        <div className="bar-content">
                          <p>{widget.text}</p>
                          <div className="risk-bar">
                            <span />
                            <span />
                            <span />
                          </div>
                          <div className="bar-legend">
                            <span>
                              <i className="red-dot" /> Critical
                            </span>
                            <span>
                              <i className="yellow-dot" /> High
                            </span>
                            <span>
                              <i className="green-dot" /> Low
                            </span>
                          </div>
                        </div>
                      )}

                      {widget.type === "custom" && (
                        <div className="custom-widget">
                          <span className="custom-icon">▤</span>
                          <p>{widget.text}</p>
                        </div>
                      )}
                    </div>
                  </article>
                ))}

                {category.widgets.length === 0 && (
                  <div className="no-widgets">
                    {search
                      ? "No widgets match your search."
                      : "No widgets in this category. Add one to get started."}
                  </div>
                )}

                <button
                  className="widget-placeholder"
                  onClick={() => {
                    setActiveCategory(category.id);
                    setShowModal(true);
                  }}
                >
                  <span>+</span>
                  <span>Add Widget</span>
                </button>
              </div>
            </section>
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <form
              className="widget-modal"
              onSubmit={addWidget}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <p className="eyebrow">CUSTOMIZE DASHBOARD</p>
                  <h2>Add a Widget</h2>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              <p className="modal-description">
                Add a custom widget to the selected dashboard category.
              </p>

              <div className="available-widget-section">
                <div className="available-widget-heading">
                  <h3>Available Widgets</h3>
                  <span>{availableWidgets.length} widgets</span>
                </div>

                <div className="available-widget-list">
                  {availableWidgets.map((widget) => {
                    const isSelected = categories
                      .find((category) => category.id === activeCategory)
                      ?.widgets.some((item) => item.id === widget.id);

                    return (
                      <label className="available-widget-item" key={widget.id}>
                        <input
                          type="checkbox"
                          checked={Boolean(isSelected)}
                          onChange={(event) =>
                            toggleCatalogWidget(widget, event.target.checked)
                          }
                        />

                        <span>
                          <strong>{widget.name}</strong>
                          <small>{widget.text}</small>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <label className="field-label" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                value={activeCategory}
                onChange={(event) => setActiveCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <label className="field-label" htmlFor="widget-name">
                Widget name
              </label>
              <input
                id="widget-name"
                value={widgetName}
                onChange={(event) => setWidgetName(event.target.value)}
                placeholder="e.g. Cloud Security Summary"
                required
                maxLength={60}
              />

              <label className="field-label" htmlFor="widget-text">
                Widget text
              </label>
              <textarea
                id="widget-text"
                value={widgetText}
                onChange={(event) => setWidgetText(event.target.value)}
                placeholder="Enter the content to display"
                rows={4}
                required
                maxLength={300}
              />

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Widget
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>AccuKnox Dashboard</span>
        <span>Cloud security overview</span>
      </footer>
    </div>
  );
}

export default App;
