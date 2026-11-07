
import { useState } from 'react'

const statuses = [
  'Başvuruldu',
  'Mülakat',
  'Kabul',
  'Red'
]

function Kanban({ applications, setApplications }) {
  const [pendingApplication, setPendingApplication] = useState(null)
  const [interviewDate, setInterviewDate] = useState('')

  // Başvuru durumunu güncelle
  function updateStatus(id, newStatus, date = '') {
    setApplications((previous) =>
      previous.map((app) =>
        app.id === id
          ? {
              ...app,
              status: newStatus,
              interviewDate: date
            }
          : app
      )
    )
  }

  // Kullanıcı durum değiştirdiğinde
  function handleStatusChange(app, newStatus) {
    if (newStatus === app.status) return

    if (newStatus === 'Mülakat') {
      setPendingApplication(app)
      setInterviewDate(app.interviewDate || '')
      return
    }

    updateStatus(app.id, newStatus)
  }

  // Mülakat tarihini kaydet
  function saveInterview() {
    if (!pendingApplication || !interviewDate) return

    updateStatus(
      pendingApplication.id,
      'Mülakat',
      interviewDate
    )

    closeModal()
  }

  // Pencereyi kapat
  function closeModal() {
    setPendingApplication(null)
    setInterviewDate('')
  }

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1>Kanban Panosu</h1>
          <p>
            Başvurularının aşamalarını kolayca yönet.
          </p>
        </div>
      </header>

      <div className="kanban-board">
        {statuses.map((status) => {
          const items = applications.filter(
            (app) => app.status === status
          )

          return (
            <section
              className="kanban-column"
              key={status}
            >
              <div className="kanban-column-header">
                <h3>{status}</h3>
                <span>{items.length}</span>
              </div>

              <div className="kanban-items">
                {items.length === 0 ? (
                  <p className="kanban-empty">
                    Bu aşamada başvuru yok.
                  </p>
                ) : (
                  items.map((app) => (
                    <div
                      className="kanban-card"
                      key={app.id}
                    >
                      <h4>{app.company}</h4>
                      <p>{app.position}</p>

                      <small>
                        Başvuru: {app.date}
                      </small>

                      {app.status === 'Mülakat' &&
                        app.interviewDate && (
                          <small className="kanban-interview-date">
                            Mülakat: {app.interviewDate}
                          </small>
                        )}

                      <select
                        aria-label={`${app.company} başvuru durumu`}
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(
                            app,
                            e.target.value
                          )
                        }
                      >
                        {statuses.map((option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))
                )}
              </div>
            </section>
          )
        })}
      </div>

      {/* Mülakat tarihi seçme penceresi */}
      {pendingApplication && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="interview-modal-title"
          >
            <h2 id="interview-modal-title">
              Mülakat Tarihi Belirle
            </h2>

            <p>
              <strong>
                {pendingApplication.company}
              </strong>
              {' — '}
              {pendingApplication.position}
            </p>

            <label htmlFor="kanbanInterviewDate">
              Mülakat Tarihi
            </label>

            <input
              id="kanbanInterviewDate"
              type="date"
              value={interviewDate}
              onChange={(e) =>
                setInterviewDate(e.target.value)
              }
              required
            />

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={closeModal}
              >
                İptal
              </button>

              <button
                type="button"
                className="save-button"
                onClick={saveInterview}
                disabled={!interviewDate}
              >
                Mülakatı Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Kanban
