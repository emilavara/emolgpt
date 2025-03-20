"use client"

import ReactMarkdown from "react-markdown";
import './main.scss'
import 'highlight.js/styles/atom-one-dark.css';
import { useState, FormEvent, useRef, useEffect } from 'react'
import axios from 'axios';

import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

export default function Home() {
	const [prompt, setPrompt] = useState("");
	const [isFetching, setIsFetching] = useState(false)
	const [chatlog, setChatlog] = useState<{ text: string; class: string }[]>([])
	const promptInput = useRef<HTMLInputElement>(null);
	const chatElement = useRef<HTMLAnchorElement>(null);
	
	useEffect(() => {
        hljs.initHighlighting();
    }, []);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
		setIsFetching(true)


		let promptToAdd = {
			text: '',
			class: ''
		}

		promptToAdd.text = prompt
		promptToAdd.class = 'prompt'

		setChatlog(prevChatlog => [...prevChatlog, promptToAdd])
		
		if (promptInput.current) {
            promptInput.current.value = ""; // Reset the input field
        }
		
		try {
			const res = await fetch("/api/gemini", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt }),
			});

	   
			if (!res.ok) {
			  	throw new Error('Failed to submit the data. Please try again.')
			}
	   
			const data = await res.json()

			let responseToAdd = {
				text: '',
				class: '',
				markdown: ''
			}
			
			responseToAdd.text = data.response
			responseToAdd.class = 'response'
			responseToAdd.markdown = data.response

			setChatlog(prevChatlog => [...prevChatlog, responseToAdd])

			setIsFetching(false)


			setTimeout(() => {
				hljs.initHighlighting();
			}, 1)

			setTimeout(() => {

				const getAllResponses = document.querySelectorAll('.response')
				const lastElement = getAllResponses[getAllResponses.length - 1]

				lastElement.scrollIntoView(false);
			}, 500)

		} catch (error) {
			console.error(error)
		}
    }
	
	return (
		<div className="app">
			<div className="chat">
				{chatlog.map(chat => (
					<div key={chat.text} className={chat.class}><ReactMarkdown>{chat.text}</ReactMarkdown></div>
				))}
				<a ref={chatElement} href="bottom"></a>
				<div className={`response loader${isFetching ? 'showing' : ''}`}>
					<span className="loader"></span>
				</div>
			</div>
			<div className="chat-input">
				<form id="formthing" onSubmit={handleSubmit}>
					<input placeholder="Fråga EmolGPT..." ref={promptInput} type="text" name="prompt" onChange={(e) => setPrompt(e.target.value)}></input>
					<button type="submit"></button>
				</form>
			</div>
		</div>
	)
}