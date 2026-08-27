import { useEffect, useState } from 'react'
import './Farmer.css'

import AccountManagement from '../../../components/AccountManagement/AccountManagement'
import Fish from '../Fish/Fish'


type ManagementType =
  | 'Farmer'
  | 'Fishes'


type StatisticsPeriod =
  | 'Total'
  | 'Today'
  | 'This Week'
  | 'This Month'


type BackendStatisticsPeriod =
  | 'total'
  | 'daily'
  | 'weekly'
  | 'monthly'


type FarmerStats = {
  farmers: number
  orders: number
  subscriptions: number
}


function Farmer() {

  /* ============================= */
  /* Management Type               */
  /* ============================= */

  const [managementType, setManagementType] =
    useState<ManagementType>('Farmer')


  const [managementDropdownOpen, setManagementDropdownOpen] =
    useState(false)


  /* ============================= */
  /* Statistics Period             */
  /* ============================= */

  const [statisticsPeriod, setStatisticsPeriod] =
    useState<StatisticsPeriod>('Total')


  const [statisticsDropdownOpen, setStatisticsDropdownOpen] =
    useState(false)


  /* ============================= */
  /* Statistics                    */
  /* ============================= */

  const [stats, setStats] =
    useState<FarmerStats>({
      farmers: 0,
      orders: 0,
      subscriptions: 0,
    })


  /* ============================= */
  /* Farmer Accounts               */
  /* ============================= */

  const [showAccounts, setShowAccounts] =
    useState(false)


  /* ============================= */
  /* Convert UI Period             */
  /* ============================= */

  const getBackendPeriod = (
    period: StatisticsPeriod
  ): BackendStatisticsPeriod => {

    switch (period) {

      case 'Today':
        return 'daily'

      case 'This Week':
        return 'weekly'

      case 'This Month':
        return 'monthly'

      case 'Total':
      default:
        return 'total'

    }

  }


  /* ============================= */
  /* Get Farmer Statistics         */
  /* ============================= */

  useEffect(() => {

    if (
      managementType !== 'Farmer' ||
      showAccounts
    ) {
      return
    }


    const params =
      new URLSearchParams()


    params.set(
      'period',
      getBackendPeriod(
        statisticsPeriod
      )
    )


    fetch(
      `http://127.0.0.1:8000/api/admin/farmer-stats/?${params.toString()}`
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Unable to get farmer statistics'
          )

        }

        return response.json()

      })
      .then((data) => {

        setStats({

          farmers:
            data.farmers ??
            data.total_farmers ??
            0,

          orders:
            data.orders ??
            data.total_orders ??
            0,

          subscriptions:
            data.subscriptions ??
            data.total_subscriptions ??
            0,

        })

      })
      .catch((error) => {

        console.error(
          'Error getting farmer statistics:',
          error
        )


        setStats({

          farmers: 0,

          orders: 0,

          subscriptions: 0,

        })

      })

  }, [
    managementType,
    statisticsPeriod,
    showAccounts
  ])


  /* ============================= */
  /* Management Selection          */
  /* ============================= */

  const handleManagementSelect = (
    type: ManagementType
  ) => {

    setManagementType(type)

    setManagementDropdownOpen(false)

    setShowAccounts(false)

  }


  /* ============================= */
  /* Statistics Selection          */
  /* ============================= */

  const handleStatisticsPeriodSelect = (
    period: StatisticsPeriod
  ) => {

    setStatisticsPeriod(period)

    setStatisticsDropdownOpen(false)

  }


  /* ============================= */
  /* Open Farmer Accounts          */
  /* ============================= */

  const handleFarmersCard = () => {

    setShowAccounts(true)

  }


  /* ============================= */
  /* Back From Farmer Accounts     */
  /* ============================= */

  const handleBackFromAccounts = () => {

    setShowAccounts(false)

    setManagementType('Farmer')

  }


  /* ============================= */
  /* Farmer Accounts Page          */
  /* ============================= */

  if (showAccounts) {

    return (

      <section className="admin-farmer-card">

        {/* ============================= */}
        {/* Farmer / Fishes Switcher       */}
        {/* ============================= */}

        <div className="admin-farmer-switcher">

          <button
            type="button"
            className="admin-farmer-select"
            onClick={() =>
              setManagementDropdownOpen(
                (current) => !current
              )
            }
            aria-haspopup="true"
            aria-expanded={
              managementDropdownOpen
            }
          >

            <span>
              Farmer
            </span>

            <span className="admin-farmer-arrow">

              {managementDropdownOpen
                ? '▴'
                : '▾'}

            </span>

          </button>


          {managementDropdownOpen && (

            <div className="admin-farmer-options">

              {/* Farmer */}

              <button
                type="button"
                className="selected"
                onClick={() =>
                  handleManagementSelect(
                    'Farmer'
                  )
                }
              >
                Farmer
              </button>


              {/* Fishes */}

              <button
                type="button"
                onClick={() =>
                  handleManagementSelect(
                    'Fishes'
                  )
                }
              >
                Fishes
              </button>

            </div>

          )}

        </div>


        {/* ============================= */}
        {/* Account Management             */}
        {/* ============================= */}

        <AccountManagement
          role="farmer"
          onBack={
            handleBackFromAccounts
          }
        />

      </section>

    )

  }


  /* ============================= */
  /* Fish Management               */
  /* ============================= */

  if (
    managementType === 'Fishes'
  ) {

    return (

      <section className="admin-farmer-card">

        {/* ============================= */}
        {/* Farmer / Fishes Switcher       */}
        {/* ============================= */}

        <div className="admin-farmer-switcher">

          <button
            type="button"
            className="admin-farmer-select"
            onClick={() =>
              setManagementDropdownOpen(
                (current) => !current
              )
            }
            aria-haspopup="true"
            aria-expanded={
              managementDropdownOpen
            }
          >

            <span>
              Fishes
            </span>

            <span className="admin-farmer-arrow">

              {managementDropdownOpen
                ? '▴'
                : '▾'}

            </span>

          </button>


          {managementDropdownOpen && (

            <div className="admin-farmer-options">

              {/* Farmer */}

              <button
                type="button"
                onClick={() =>
                  handleManagementSelect(
                    'Farmer'
                  )
                }
              >
                Farmer
              </button>


              {/* Fishes */}

              <button
                type="button"
                className="selected"
                onClick={() =>
                  handleManagementSelect(
                    'Fishes'
                  )
                }
              >
                Fishes
              </button>

            </div>

          )}

        </div>


        {/* ============================= */}
        {/* Fish Management               */}
        {/* ============================= */}

        <Fish />

      </section>

    )

  }


  /* ============================= */
  /* Main Farmer Dashboard         */
  /* ============================= */

  return (

    <section className="admin-farmer-card">

      {/* ============================= */}
      {/* Farmer / Fishes Switcher      */}
      {/* ============================= */}

      <div className="admin-farmer-switcher">

        <button
          type="button"
          className="admin-farmer-select"
          onClick={() =>
            setManagementDropdownOpen(
              (current) => !current
            )
          }
          aria-haspopup="true"
          aria-expanded={
            managementDropdownOpen
          }
        >

          <span>
            Farmer
          </span>

          <span className="admin-farmer-arrow">

            {managementDropdownOpen
              ? '▴'
              : '▾'}

          </span>

        </button>


        {managementDropdownOpen && (

          <div className="admin-farmer-options">

            {/* Farmer */}

            <button
              type="button"
              className="selected"
              onClick={() =>
                handleManagementSelect(
                  'Farmer'
                )
              }
            >
              Farmer
            </button>


            {/* Fishes */}

            <button
              type="button"
              onClick={() =>
                handleManagementSelect(
                  'Fishes'
                )
              }
            >
              Fishes
            </button>

          </div>

        )}

      </div>


      {/* ============================= */}
      {/* Farmer Header                 */}
      {/* ============================= */}

      <div className="admin-farmer-header">

        <div>

          <h2>
            Farmer
          </h2>

          <p>
            Manage and monitor farmer activity.
          </p>

        </div>


        {/* ============================= */}
        {/* Statistics Period             */}
        {/* ============================= */}

        <div className="admin-farmer-period">

          <button
            type="button"
            className="admin-farmer-period-select"
            onClick={() =>
              setStatisticsDropdownOpen(
                (current) => !current
              )
            }
            aria-haspopup="true"
            aria-expanded={
              statisticsDropdownOpen
            }
          >

            <span>
              {statisticsPeriod}
            </span>

            <span className="admin-farmer-period-arrow">

              {statisticsDropdownOpen
                ? '▴'
                : '▾'}

            </span>

          </button>


          {statisticsDropdownOpen && (

            <div className="admin-farmer-period-options">

              {/* Total */}

              <button
                type="button"
                className={
                  statisticsPeriod === 'Total'
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  handleStatisticsPeriodSelect(
                    'Total'
                  )
                }
              >
                Total
              </button>


              {/* Today */}

              <button
                type="button"
                className={
                  statisticsPeriod === 'Today'
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  handleStatisticsPeriodSelect(
                    'Today'
                  )
                }
              >
                Today
              </button>


              {/* This Week */}

              <button
                type="button"
                className={
                  statisticsPeriod === 'This Week'
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  handleStatisticsPeriodSelect(
                    'This Week'
                  )
                }
              >
                This Week
              </button>


              {/* This Month */}

              <button
                type="button"
                className={
                  statisticsPeriod === 'This Month'
                    ? 'selected'
                    : ''
                }
                onClick={() =>
                  handleStatisticsPeriodSelect(
                    'This Month'
                  )
                }
              >
                This Month
              </button>

            </div>

          )}

        </div>

      </div>


      {/* ============================= */}
      {/* Statistics Cards              */}
      {/* ============================= */}

      <div className="admin-farmer-statistics">

        {/* ============================= */}
        {/* Farmers                       */}
        {/* ============================= */}

        <button
          type="button"
          className="admin-farmer-stat-card"
          onDoubleClick={
            handleFarmersCard
          }
        >

          <div className="admin-farmer-stat-icon">
            ♙
          </div>

          <div className="admin-farmer-stat-label">
            Farmers
          </div>

          <div className="admin-farmer-stat-value">
            {stats.farmers}
          </div>

        </button>


        {/* ============================= */}
        {/* Orders                        */}
        {/* ============================= */}

        <button
          type="button"
          className="admin-farmer-stat-card"
          onClick={() => {

            console.log(
              'Farmer Orders selected'
            )

          }}
        >

          <div className="admin-farmer-stat-icon">
            ▣
          </div>

          <div className="admin-farmer-stat-label">
            Orders
          </div>

          <div className="admin-farmer-stat-value">
            {stats.orders}
          </div>

        </button>


        {/* ============================= */}
        {/* Subscriptions                 */}
        {/* ============================= */}

        <button
          type="button"
          className="admin-farmer-stat-card"
          onClick={() => {

            console.log(
              'Farmer Subscriptions selected'
            )

          }}
        >

          <div className="admin-farmer-stat-icon">
            ↻
          </div>

          <div className="admin-farmer-stat-label">
            Subscriptions
          </div>

          <div className="admin-farmer-stat-value">
            {stats.subscriptions}
          </div>

        </button>

      </div>

    </section>

  )

}


export default Farmer