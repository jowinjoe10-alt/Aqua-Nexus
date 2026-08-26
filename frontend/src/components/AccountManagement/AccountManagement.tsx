import { useEffect, useState } from 'react'
import './AccountManagement.css'


type AccountRole =
  'farmer' |
  'vendor'


type Account = {
  id: number
  name: string
  gmail: string
  city: string
  state: string
  created_at: string
}


type SortType =
  'id_asc' |
  'id_desc' |
  'name_asc' |
  'name_desc' |
  'location_asc' |
  'created_latest' |
  'created_earliest'


type AccountManagementProps = {
  role: AccountRole

  onBack: () => void
}


function AccountManagement({
  role,
  onBack
}: AccountManagementProps) {

  const [accounts, setAccounts] =
    useState<Account[]>([])

  const [search, setSearch] =
    useState('')

  const [sort, setSort] =
    useState<SortType>('id_asc')

  const [sortDropdownOpen, setSortDropdownOpen] =
    useState(false)


  /* ============================= */
  /* Page Information              */
  /* ============================= */

  const accountTitle =
    role === 'farmer'
      ? 'Farmer Accounts'
      : 'Vendor Accounts'

  const accountDescription =
    role === 'farmer'
      ? 'Manage registered farmer accounts.'
      : 'Manage registered vendor accounts.'


  /* ============================= */
  /* Get Accounts                  */
  /* ============================= */

  useEffect(() => {

    const params =
      new URLSearchParams()

    params.set(
      'role',
      role
    )

    if (search.trim()) {

      params.set(
        'search',
        search.trim()
      )

    }

    params.set(
      'sort',
      sort
    )


    /*
     * Farmer currently uses the existing
     * farmer endpoint.
     *
     * Vendor will use the vendor endpoint.
     */

    const endpoint =
      role === 'farmer'
        ? 'http://127.0.0.1:8000/api/admin/farmers/'
        : 'http://127.0.0.1:8000/api/admin/vendors/'


    fetch(
      `${endpoint}?${params.toString()}`
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Unable to get accounts'
          )

        }

        return response.json()

      })
      .then((data) => {

        setAccounts(
          data.accounts ||
          data.farmers ||
          data.vendors ||
          []
        )

      })
      .catch((error) => {

        console.error(
          'Error getting accounts:',
          error
        )

        setAccounts([])

      })

  }, [
    role,
    search,
    sort
  ])


  return (

    <div className="account-management">


      {/* ============================= */}
      {/* Header                        */}
      {/* ============================= */}

      <div className="account-management-header">


        {/* ============================= */}
        {/* Back Button                   */}
        {/* ============================= */}

        <button
          type="button"
          className="account-management-back"
          onClick={onBack}
        >
          ← Back
        </button>


        <h2>
          {accountTitle}
        </h2>


        <p>
          {accountDescription}
        </p>

      </div>


      {/* ============================= */}
      {/* Controls                      */}
      {/* ============================= */}

      <div className="account-management-controls">


        {/* ============================= */}
        {/* Search                        */}
        {/* ============================= */}

        <div className="account-management-search">

          <input
            type="text"
            placeholder={
              'Search by name, ID or location...'
            }
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>


        {/* ============================= */}
        {/* Sort                          */}
        {/* ============================= */}

        <div className="account-management-sort">

          <button
            type="button"
            className="account-management-sort-select"
            onClick={() =>
              setSortDropdownOpen(
                (current) => !current
              )
            }
            aria-haspopup="true"
            aria-expanded={
              sortDropdownOpen
            }
          >

            <span>
              Sort
            </span>

            <span>
              {sortDropdownOpen
                ? '▴'
                : '▾'}
            </span>

          </button>


          {sortDropdownOpen && (

            <div className="account-management-sort-options">


              {/* ============================= */}
              {/* Name A - Z                    */}
              {/* ============================= */}

              <button
                type="button"
                onClick={() => {

                  setSort(
                    'name_asc'
                  )

                  setSortDropdownOpen(
                    false
                  )

                }}
              >
                Name: A - Z
              </button>


              {/* ============================= */}
              {/* Name Z - A                    */}
              {/* ============================= */}

              <button
                type="button"
                onClick={() => {

                  setSort(
                    'name_desc'
                  )

                  setSortDropdownOpen(
                    false
                  )

                }}
              >
                Name: Z - A
              </button>


              {/* ============================= */}
              {/* ID Ascending                  */}
              {/* ============================= */}

              <button
                type="button"
                onClick={() => {

                  setSort(
                    'id_asc'
                  )

                  setSortDropdownOpen(
                    false
                  )

                }}
              >
                ID: Ascending
              </button>


              {/* ============================= */}
              {/* ID Descending                 */}
              {/* ============================= */}

              <button
                type="button"
                onClick={() => {

                  setSort(
                    'id_desc'
                  )

                  setSortDropdownOpen(
                    false
                  )

                }}
              >
                ID: Descending
              </button>


              {/* ============================= */}
              {/* Location A - Z                */}
              {/* ============================= */}

              <button
                type="button"
                onClick={() => {

                  setSort(
                    'location_asc'
                  )

                  setSortDropdownOpen(
                    false
                  )

                }}
              >
                Location: A - Z
              </button>


              {/* ============================= */}
              {/* Created Latest                */}
              {/* ============================= */}

              <button
                type="button"
                onClick={() => {

                  setSort(
                    'created_latest'
                  )

                  setSortDropdownOpen(
                    false
                  )

                }}
              >
                Created: Latest
              </button>


              {/* ============================= */}
              {/* Created Earliest              */}
              {/* ============================= */}

              <button
                type="button"
                onClick={() => {

                  setSort(
                    'created_earliest'
                  )

                  setSortDropdownOpen(
                    false
                  )

                }}
              >
                Created: Earliest
              </button>

            </div>

          )}

        </div>

      </div>


      {/* ============================= */}
      {/* Account List                  */}
      {/* ============================= */}

      <div className="account-management-list">

        {accounts.map((account) => (

          <div
            key={account.id}
            className="account-management-card"
          >


            {/* ============================= */}
            {/* Account ID                    */}
            {/* ============================= */}

            <div className="account-management-id">

              #{account.id}

            </div>


            {/* ============================= */}
            {/* Account Information           */}
            {/* ============================= */}

            <div className="account-management-main">

              <span className="account-management-name">

                {account.name}

              </span>


              <span className="account-management-location">

                {account.city}

                {account.city &&
                account.state
                  ? ', '
                  : ''}

                {account.state}

              </span>

            </div>


            {/* ============================= */}
            {/* Delete                        */}
            {/* ============================= */}

            <button
              type="button"
              className="account-management-delete"
              onClick={(event) => {

                event.stopPropagation()

              }}
            >
              Delete
            </button>

          </div>

        ))}


        {/* ============================= */}
        {/* No Results                    */}
        {/* ============================= */}

        {accounts.length === 0 && (

          <div className="account-management-no-results">

            No {role} accounts found.

          </div>

        )}

      </div>

    </div>

  )
}


export default AccountManagement