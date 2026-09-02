import { useEffect, useState } from 'react'
import './Notifications.css'


type NotificationData = {
  id: number
  recipient: number
  recipient_name: string
  pond: number | null
  pond_name: string | null
  fish: number | null
  fish_name: string | null
  old_stage: number | null
  old_stage_number: number | null
  new_stage: number | null
  new_stage_number: number | null
  message: string
  is_read: boolean
  created_at: string
}


type NotificationProps = {
  accountId: string
  onBack: () => void
}


function Notification({
  accountId,
  onBack
}: NotificationProps) {

  const [
    notifications,
    setNotifications
  ] = useState<NotificationData[]>([])

  const [
    loading,
    setLoading
  ] = useState(true)

  const [
    error,
    setError
  ] = useState('')


  /* ============================= */
  /* Load Notifications            */
  /* ============================= */

  const loadNotifications = async () => {

    try {

      setLoading(true)

      const response = await fetch(
        `/api/pond/notifications/?recipient_id=${accountId}`
      )

      if (!response.ok) {

        throw new Error(
          'Unable to load notifications'
        )

      }

      const data =
        await response.json()

      setNotifications(data)

      setError('')

    } catch (error) {

      console.error(
        'Notification loading error:',
        error
      )

      setError(
        'Unable to load notifications.'
      )

    } finally {

      setLoading(false)

    }

  }


  /* ============================= */
  /* Load On Page Open              */
  /* ============================= */

  useEffect(() => {

    loadNotifications()

  }, [accountId])


  /* ============================= */
  /* Mark Notification As Read     */
  /* ============================= */

  const handleNotificationView = async (
    notificationId: number
  ) => {

    const notification =
      notifications.find(
        (item) =>
          item.id === notificationId
      )

    if (!notification) {
      return
    }

    if (notification.is_read) {
      return
    }


    try {

      const response = await fetch(
        `/api/pond/notifications/${notificationId}/read/?recipient_id=${accountId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            is_read: true
          })
        }
      )


      if (!response.ok) {

        throw new Error(
          'Unable to mark notification as read'
        )

      }


      setNotifications(
        (currentNotifications) =>
          currentNotifications.map(
            (item) =>
              item.id === notificationId
                ? {
                    ...item,
                    is_read: true
                  }
                : item
          )
      )

    } catch (error) {

      console.error(
        'Notification read error:',
        error
      )

    }

  }


  /* ============================= */
  /* Notification Time              */
  /* ============================= */

  const getNotificationTime = (
    createdAt: string
  ) => {

    const createdTime =
      new Date(createdAt)

    const currentTime =
      new Date()

    const difference =
      currentTime.getTime()
      -
      createdTime.getTime()

    const minutes =
      Math.floor(
        difference / 60000
      )

    if (minutes < 1) {
      return 'Just now'
    }

    if (minutes < 60) {
      return `${minutes} min ago`
    }


    const hours =
      Math.floor(
        minutes / 60
      )

    if (hours < 24) {
      return `${hours} hr ago`
    }


    const days =
      Math.floor(
        hours / 24
      )

    if (days < 10) {
      return `${days} day${days === 1 ? '' : 's'} ago`
    }


    return '10 days ago'

  }


  return (
    <div className="notification-page">

      {/* ============================= */}
      {/* Notification Header            */}
      {/* ============================= */}

      <div className="notification-header">

        <button
          type="button"
          className="notification-back-button"
          onClick={onBack}
        >
          ←
        </button>

        <h2>
          Notifications
        </h2>

      </div>


      {/* ============================= */}
      {/* Loading                        */}
      {/* ============================= */}

      {loading && (
        <div className="notification-status">
          Loading notifications...
        </div>
      )}


      {/* ============================= */}
      {/* Error                          */}
      {/* ============================= */}

      {!loading && error && (
        <div className="notification-status notification-error">
          {error}
        </div>
      )}


      {/* ============================= */}
      {/* Empty State                    */}
      {/* ============================= */}

      {!loading &&
        !error &&
        notifications.length === 0 && (
          <div className="notification-empty">

            <div className="notification-empty-icon">
              🔔
            </div>

            <h3>
              No notifications
            </h3>

            <p>
              You are all caught up.
            </p>

          </div>
        )}


      {/* ============================= */}
      {/* Notification Cards             */}
      {/* ============================= */}

      {!loading &&
        !error &&
        notifications.length > 0 && (

          <div className="notification-list">

            {notifications.map(
              (notification) => (

                <div
                  key={notification.id}
                  className={
                    notification.is_read
                      ? 'notification-card'
                      : 'notification-card notification-unread'
                  }
                  onMouseEnter={() =>
                    handleNotificationView(
                      notification.id
                    )
                  }
                  onClick={() =>
                    handleNotificationView(
                      notification.id
                    )
                  }
                >

                  {!notification.is_read && (
                    <span className="notification-unread-dot" />
                  )}


                  <div className="notification-card-content">

                    <p className="notification-message">
                      {notification.message}
                    </p>

                    <span className="notification-time">
                      {getNotificationTime(
                        notification.created_at
                      )}
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        )}

    </div>
  )
}


export default Notification