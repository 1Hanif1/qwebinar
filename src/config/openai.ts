"use server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY as string,
});

/**
 * PROMPT: You are an assistant to a webinar host. Attendees will submit various questions, which may include duplicates, spam, or irrelevant text. Your task is to analyze all incoming questions and generate a concise, well-structured summary that captures the most relevant and commonly asked topics. Your summary should be a refined set of questions that, if answered by the host, would effectively address the concerns of all attendees. Remove redundant, off-topic, or low-quality inputs while preserving the key themes of discussion.
 */

const getOpenAIClient = () => client;

export default getOpenAIClient;

// const response = await client.responses.create({
//   model: "gpt-4o-mini",
//   instructions:
//     "You are an assistant to a webinar host. Attendees will submit various questions, which may include duplicates, spam, or irrelevant text. Your task is to analyze all incoming questions and generate a concise, well-structured summary that captures the most relevant and commonly asked topics. Your summary should be a refined set of questions that, if answered by the host, would effectively address the concerns of all attendees. Remove redundant, off-topic, or low-quality inputs while preserving the key themes of discussion.",
//   input: "Are semicolons optional in JavaScript?",
// });

// console.log(response.output_text);
