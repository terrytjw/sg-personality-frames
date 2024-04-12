/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { neynar } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import {
  fetchAllFollowing,
  fetchUser,
  fetchFeedByFids,
  fetchAndProcessFeeds,
} from "@/app/lib/farcaster";
import { dummyQuizData, dummyWarpcastData } from "@/app/data";
import { classifyPersonality } from "@/app/lib/openai";
import { questions } from "@/app/data";

type State = {
  user: any;
  userCastsData: any;
  qn_one: string;
  qn_two: string;
  qn_three: string;
  qn_four: string;
};

const app = new Frog<{ State: State }>({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: "NEYNAR_FROG_FM" }),
  initialState: {
    userCastsData: [],
    user: {},
    qn_one: "",
    qn_two: "",
    qn_three: "",
    qn_four: "",
  },
});

let result = {
  userCastsData: [],
  user: {},
  qn_one: "",
  qn_two: "",
  qn_three: "",
  qn_four: "",
};
let qna = [
  {
    question: "How do you use Warpcast?",
    answer: "",
  },
  {
    question: "What's your posting style?",
    answer: "",
  },
  {
    question: "What's your main content?",
    answer: "",
  },
  {
    question: "How do others describe you?",
    answer: "",
  },
];

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", async (c) => {
  const { buttonValue, inputText, status, deriveState } = c;
  // const fruit = inputText || buttonValue;
  // console.log(feeds, "feeds");
  const user = (await fetchUser(5650))?.result?.user;
  console.log(user, "user");
  const feeds: any = await fetchAndProcessFeeds(5650);
  const state = await deriveState(async (previousState) => {
    console.log(state, "in the state");
    previousState.user = user;
    previousState.userCastsData = feeds;
  });
  result.user = user;
  result.userCastsData = feeds;
  // TODO: ai stuff

  await classifyPersonality(dummyWarpcastData, dummyQuizData);

  return c.res({
    action: "/q1",
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        {/* <img src="https://i.kym-cdn.com/entries/icons/mobile/000/032/280/meme1.jpg" /> */}
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          Welcome, <br />
          {user.displayName}!
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          Want to know what kind of farcasters are you?
        </div>
        <div
          style={{
            color: "yellow",
            fontSize: 20,
            fontStyle: "italic",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 60,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          (Do wait for your username to appear)
        </div>
      </div>
    ),
    intents: [
      // <Button value="A">A</Button>,
      <Button value={"continue"}>Continue</Button>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/q1", (c) => {
  const { buttonValue, inputText, status, deriveState } = c;
  const fruit = inputText || buttonValue;
  console.log(result, "result");

  console.log(c, "c2");
  return c.res({
    action: "/q2",
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            flexDirection: "row",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {questions[0].question}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          A. {questions[0].options[0]}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          B. {questions[0].options[1]}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          C. {questions[0].options[2]}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          D. {questions[0].options[3]}
        </div>
      </div>
    ),
    intents: [
      <Button value={questions[0]?.options[0]}>A</Button>,
      <Button value={questions[0]?.options[1]}>B</Button>,
      <Button value={questions[0]?.options[2]}>C</Button>,
      <Button value={questions[0]?.options[3]}>D</Button>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/q2", (c) => {
  const { buttonValue, inputText, status, deriveState } = c;
  const fruit = inputText || buttonValue;
  console.log(result, "result");
  result.qn_one = buttonValue;
  console.log(c, "c2");
  return c.res({
    action: "/q3",
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            flexDirection: "row",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {questions[1].question}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          A. {questions[1].options[0]}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          B. {questions[1].options[1]}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          C. {questions[1].options[2]}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          D. {questions[1].options[3]}
        </div>
      </div>
    ),
    intents: [
      <Button value={questions[1]?.options[0]}>A</Button>,
      <Button value={questions[1]?.options[1]}>B</Button>,
      <Button value={questions[1]?.options[2]}>C</Button>,
      <Button value={questions[1]?.options[3]}>D</Button>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/q3", (c) => {
  const { buttonValue, inputText, status, deriveState } = c;
  const fruit = inputText || buttonValue;
  console.log(result, "result");
  result.qn_two = buttonValue;
  console.log(c, "c2");
  return c.res({
    action: "/q4",
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            flexDirection: "row",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {questions[2].question}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          A. {questions[2].options[0]}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          B. {questions[2].options[1]}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          C. {questions[2].options[2]}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          D. {questions[2].options[3]}
        </div>
      </div>
    ),
    intents: [
      <Button value={questions[2]?.options[0]}>A</Button>,
      <Button value={questions[2]?.options[1]}>B</Button>,
      <Button value={questions[2]?.options[2]}>C</Button>,
      <Button value={questions[2]?.options[3]}>D</Button>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/q4", (c) => {
  const { buttonValue, inputText, status, deriveState } = c;
  const fruit = inputText || buttonValue;
  console.log(result, "result");
  result.qn_four = buttonValue;
  console.log(c, "c2");
  return c.res({
    action: "/result",
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            flexDirection: "row",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {questions[3].question}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          A. {questions[3].options[0]}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          B. {questions[3].options[1]}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          C. {questions[3].options[2]}
        </div>
        <div
          style={{
            color: "white",
            fontSize: 30,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            display: "flex",
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          D. {questions[3].options[3]}
        </div>
      </div>
    ),
    intents: [
      <Button value={questions[3]?.options[0]}>A</Button>,
      <Button value={questions[3]?.options[1]}>B</Button>,
      <Button value={questions[3]?.options[2]}>C</Button>,
      <Button value={questions[3]?.options[3]}>D</Button>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/q4", (c) => {
  const { buttonValue, inputText, status, deriveState } = c;
  const fruit = inputText || buttonValue;
  console.log(result, "result");
  result.qn_four = buttonValue;
  console.log(c, "c2");
  return c.res({
    action: "/result",
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      ></div>
    ),
    intents: [
      <Button value={questions[3]?.options[0]}>Like</Button>,
      <Button value={questions[3]?.options[0]}>Share</Button>,
      // status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
