import {
  useEffect,
  useState
} from 'react'

import './Chat.css'


type ChatProps = {
  role: 'farmer' | 'vendor'
}


type Account = {
  id: number
  name: string
  role: string
}


type ChatItem = {
  id: number

  farmer: number
  farmer_name: string

  vendor: number
  vendor_name: string

  product: number
  product_name: string
  brand_name: string

  question: string
  reply: string

  created_at: string

  vendor_replied_at: string | null
  farmer_read_at: string | null
  expires_at: string | null
}


function Chat({
  role
}: ChatProps) {

  const [account, setAccount] =
    useState<Account | null>(null)


  const [chats, setChats] =
    useState<ChatItem[]>([])


  const [loading, setLoading] =
    useState(true)


  const [error, setError] =
    useState('')


  const [replyText, setReplyText] =
    useState<{
      [key: number]: string
    }>({})


  const [sendingReply, setSendingReply] =
    useState<number | null>(null)


  /* ============================= */
  /* Load Account                  */
  /* ============================= */

  useEffect(() => {

    const storedAccount =
      localStorage.getItem(
        'aquaNexusAccount'
      )


    if (!storedAccount) {

      setError(
        'Account information unavailable.'
      )

      setLoading(false)

      return
    }


    try {

      const parsedAccount: Account =
        JSON.parse(
          storedAccount
        )

      setAccount(
        parsedAccount
      )

    } catch (error) {

      console.error(
        'Unable to read account:',
        error
      )

      setError(
        'Unable to read account information.'
      )

      setLoading(false)

    }

  }, [])


  /* ============================= */
  /* Load Chats                    */
  /* ============================= */

  const loadChats = async (
    currentAccount: Account
  ) => {

    setLoading(true)
    setError('')


    try {

      let url = ''


      if (role === 'vendor') {

        url =
          `http://127.0.0.1:8000/api/product/chat/vendor/?vendor_id=${currentAccount.id}`

      } else {

        url =
          `http://127.0.0.1:8000/api/product/chat/farmer/?farmer_id=${currentAccount.id}`

      }


      const response =
        await fetch(
          url
        )


      if (!response.ok) {

        throw new Error(
          'Unable to load chats'
        )

      }


      const data =
        await response.json()


      setChats(
        data
      )


    } catch (error) {

      console.error(
        'Chat load error:',
        error
      )

      setError(
        'Unable to load chats.'
      )

    } finally {

      setLoading(false)

    }

  }


  /* ============================= */
  /* Load Chats After Account      */
  /* ============================= */

  useEffect(() => {

    if (!account) {
      return
    }

    loadChats(
      account
    )

  }, [
    account,
    role
  ])


  /* ============================= */
  /* Vendor Reply                  */
  /* ============================= */

  const handleReply = async (
    chatId: number
  ) => {

    if (!account) {
      return
    }


    const reply =
      replyText[
        chatId
      ]?.trim()


    if (!reply) {
      return
    }


    setSendingReply(
      chatId
    )


    try {

      const response =
        await fetch(
          `http://127.0.0.1:8000/api/product/chat/${chatId}/reply/`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({

              vendor_id:
                account.id,

              reply:
                reply,

            }),

          }
        )


      const data =
        await response.json()


      if (!response.ok) {

        setError(
          data.error ||
          data.message ||
          'Unable to send reply.'
        )

        return

      }


      setReplyText(
        (current) => ({
          ...current,

          [chatId]: '',
        })
      )


      await loadChats(
        account
      )


    } catch (error) {

      console.error(
        'Reply error:',
        error
      )

      setError(
        'Unable to send reply.'
      )

    } finally {

      setSendingReply(
        null
      )

    }

  }


  /* ============================= */
  /* Farmer Send Message           */
  /* ============================= */

  const handleFarmerMessage = async (
    chat: ChatItem
  ) => {

    if (!account) {
      return
    }


    const question =
      replyText[
        chat.id
      ]?.trim()


    if (!question) {
      return
    }


    setSendingReply(
      chat.id
    )


    try {

      const response =
        await fetch(
          'http://127.0.0.1:8000/api/product/chat/',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body: JSON.stringify({

              farmer_id:
                account.id,

              vendor_id:
                chat.vendor,

              product_id:
                chat.product,

              question:
                question,

            }),

          }
        )


      const data =
        await response.json()


      if (!response.ok) {

        setError(
          data.error ||
          data.message ||
          'Unable to send message.'
        )

        return

      }


      setReplyText(
        (current) => ({
          ...current,

          [chat.id]: '',
        })
      )


      await loadChats(
        account
      )


    } catch (error) {

      console.error(
        'Farmer message error:',
        error
      )

      setError(
        'Unable to send message.'
      )

    } finally {

      setSendingReply(
        null
      )

    }

  }


  /* ============================= */
  /* Mark Farmer Chat As Read      */
  /* ============================= */

  const handleFarmerRead = async (
    chat: ChatItem
  ) => {

    if (!account) {
      return
    }


    if (
      role !== 'farmer' ||
      !chat.reply ||
      chat.farmer_read_at
    ) {

      return

    }


    try {

      await fetch(
        `http://127.0.0.1:8000/api/product/chat/${chat.id}/read/`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({

            farmer_id:
              account.id,

          }),

        }
      )


      setChats(
        (currentChats) =>
          currentChats.map(
            (currentChat) =>
              currentChat.id === chat.id
                ? {
                    ...currentChat,
                    farmer_read_at:
                      new Date().toISOString()
                  }
                : currentChat
          )
      )


    } catch (error) {

      console.error(
        'Read status error:',
        error
      )

    }

  }


  /* ============================= */
  /* Loading                       */
  /* ============================= */

  if (loading) {

    return (

      <div className="chat-container">

        <p className="chat-status">
          Loading chats...
        </p>

      </div>

    )

  }


  /* ============================= */
  /* Error                         */
  /* ============================= */

  if (
    error &&
    chats.length === 0
  ) {

    return (

      <div className="chat-container">

        <p className="chat-error">
          {error}
        </p>

      </div>

    )

  }


  /* ============================= */
  /* Chat UI                       */
  /* ============================= */

  return (

    <div className="chat-container">


      <div className="chat-header">

        <span className="chat-eyebrow">
          AQUA NEXUS
        </span>


        <h2>
          Chat
        </h2>


        <p>

          {role === 'vendor'
            ? 'Questions received from farmers.'
            : 'Replies received from vendors.'}

        </p>

      </div>


      {error && (

        <p className="chat-error">
          {error}
        </p>

      )}


      {chats.length === 0 && (

        <div className="chat-empty">

          <p>
            No chats available.
          </p>

        </div>

      )}


      <div className="chat-list">


        {chats.map(
          (chat) => (

            <div
              className="chat-card"
              key={chat.id}
            >


              <div className="chat-card-top">


                <div>

                  <span className="chat-person">

                    {role === 'vendor'
                      ? chat.farmer_name
                      : chat.vendor_name}

                  </span>


                  <span className="chat-product">

                    {chat.brand_name}

                    {' • '}

                    {chat.product_name}

                  </span>

                </div>


                {role === 'vendor' &&
                  !chat.reply && (

                  <span className="chat-new">
                    NEW
                  </span>

                )}


                {role === 'farmer' &&
                  chat.reply &&
                  !chat.farmer_read_at && (

                  <span className="chat-new">
                    NEW REPLY
                  </span>

                )}

              </div>


              <div
                className="chat-question"
                onClick={() =>
                  handleFarmerRead(chat)
                }
              >

                <span>

                  {role === 'vendor'
                    ? 'Farmer Question'
                    : 'Your Question'}

                </span>


                <p>
                  {chat.question}
                </p>

              </div>


              {chat.reply && (

                <div
                  className="chat-reply"
                  onClick={() =>
                    handleFarmerRead(chat)
                  }
                >

                  <span>
                    Vendor Reply
                  </span>


                  <p>
                    {chat.reply}
                  </p>

                </div>

              )}


              {/* ============================= */}
              {/* Farmer Send Message            */}
              {/* ============================= */}

              


              {/* ============================= */}
              {/* Vendor Reply Form              */}
              {/* ============================= */}

              {role === 'vendor' &&
                !chat.reply && (

                <div className="chat-reply-form">


                  <textarea
                    placeholder="Type your reply..."
                    value={
                      replyText[
                        chat.id
                      ] || ''
                    }
                    onChange={(
                      event
                    ) => {

                      setReplyText(
                        (current) => ({
                          ...current,

                          [chat.id]:
                            event.target.value,

                        })
                      )

                    }}
                  />


                  <button
                    type="button"
                    onClick={() =>
                      handleReply(
                        chat.id
                      )
                    }
                    disabled={
                      sendingReply ===
                      chat.id
                    }
                  >

                    {sendingReply === chat.id
                      ? 'Sending...'
                      : 'Send Reply'}

                  </button>

                </div>

              )}


              {role === 'vendor' &&
                chat.reply && (

                <div className="chat-replied-status">
                  Replied
                </div>

              )}

            </div>

          )
        )}

      </div>

    </div>

  )

}


export default Chat