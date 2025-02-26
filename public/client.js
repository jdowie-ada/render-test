const fetchMessages = async () => {
    const statusElement = document.getElementById('status');
    const messagesElement = document.getElementById('messages');

    statusElement.textContent = 'Fetching messages...';
    messagesElement.innerHTML = '';

    try {
        const response = await fetch('/api/messages');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        statusElement.textContent = `Fetched ${Array.isArray(data) ? data.length : 0} messages`;

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(message => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';

                if (typeof message === 'object') {
                    try {
                        const formattedContent = JSON.stringify(message, null, 2);
                        messageDiv.innerHTML = `<pre>${formattedContent}</pre>`;
                    } catch (e) {
                        messageDiv.textContent = JSON.stringify(message);
                    }
                } else {
                    messageDiv.textContent = message;
                }

                messagesElement.appendChild(messageDiv);
            });
        } else {
            messagesElement.textContent = 'No messages found or invalid response format';
        }
    } catch (error) {
        statusElement.textContent = `Error: ${error.message}`;
        console.error('Fetch error:', error);
    }
}

document.getElementById('fetchBtn').addEventListener('click', fetchMessages);