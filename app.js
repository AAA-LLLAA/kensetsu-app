let history = JSON.parse(
  localStorage.getItem("history")
) || [];

let wrongQuestions = JSON.parse(
  localStorage.getItem("wrongQuestions")
) || [];

/* 勘定科目 */

const accounts = [

  "現金",
  "当座預金",
  "普通預金",
  "完成工事未収入金",
  "未成工事支出金",
  "未成工事受入金",
  "完成工事高",
  "完成工事原価",
  "材料貯蔵品",
  "工事未払金",
  "買掛金",
  "売掛金",
  "受取手形",
  "支払手形",
  "減価償却費",
  "機械装置",
  "租税公課",
  "通信費",
  "旅費交通費",
  "水道光熱費",
  "消耗品費"

];

/* AI単語 */

const subjects = [
  "完成工事代金",
  "請負工事代金",
  "完成した工事代金"
];

const methods = [
  "現金",
  "当座預金",
  "普通預金"
];

const materials = [
  "工事用材料",
  "現場材料",
  "工事現場で使用する材料"
];

/* テンプレ */

const templates = [

/* 単一仕訳 */

{

  category:"収益",

  type:"single",

  text:(a,m)=>
  `${subjects[random(subjects)]} ${a.toLocaleString()}円 を ${m} で受け取った。`,

  debits:(m)=>[m],

  credits:["完成工事高"],

  explanation:
  "完成工事代金を受け取ったため、貸方は完成工事高となる。"

},

{

  category:"材料",

  type:"single",

  text:(a)=>
  `${materials[random(materials)]} ${a.toLocaleString()}円 を掛けで購入した。`,

  debits:()=>["材料貯蔵品"],

  credits:["買掛金"],

  explanation:
  "材料を掛けで購入したため買掛金が発生する。"

},

{

  category:"進行基準",

  type:"single",

  text:(a)=>
  `工事進行基準により ${a.toLocaleString()}円 の収益を計上した。`,

  debits:()=>["完成工事未収入金"],

  credits:["完成工事高"],

  explanation:
  "工事進行基準では進捗に応じて収益計上する。"

},

{

  category:"原価",

  type:"single",

  text:(a)=>
  `完成工事に対応する工事原価 ${a.toLocaleString()}円 を振り替えた。`,

  debits:()=>["完成工事原価"],

  credits:["未成工事支出金"],

  explanation:
  "完成した工事に対応する原価を費用化する。"

},

/* 複合仕訳 */

{

  category:"複合",

  type:"multi",

  text:(a,b)=>
  `${materials[random(materials)]} ${a.toLocaleString()}円 を掛けで購入し、
  運搬費 ${b.toLocaleString()}円 を現金で支払った。`,

  debits:()=>["材料貯蔵品","通信費"],

  credits:["買掛金","現金"],

  explanation:
  "材料購入と運搬費支払を同時に処理する複合仕訳。"

},

{

  category:"複合",

  type:"multi",

  text:(a,b)=>
  `工事未払金 ${a.toLocaleString()}円 を当座預金で支払い、
  手数料 ${b.toLocaleString()}円 を現金で支払った。`,

  debits:()=>["工事未払金","通信費"],

  credits:["当座預金","現金"],

  explanation:
  "工事未払金支払と手数料支払を同時処理する。"

},

{

  category:"複合",

  type:"multi",

  text:(a,b)=>
  `工事用消耗品 ${a.toLocaleString()}円 を現金で購入し、
  水道光熱費 ${b.toLocaleString()}円 を普通預金から支払った。`,

  debits:()=>["消耗品費","水道光熱費"],

  credits:["現金","普通預金"],

  explanation:
  "複数費用を同時に処理する複合仕訳。"

}

];

/* ランダム */

function random(arr){

  return Math.floor(
    Math.random()*arr.length
  );

}

function randomAmount(){

  return Math.floor(
    Math.random()*900+100
  ) * 1000;

}

/* 問題生成 */

function generateQuestions(num){

  const result = [];

  for(let i=0;i<num;i++){

    const t =
    templates[
      random(templates)
    ];

    const a = randomAmount();
    const b = randomAmount();

    const method =
    methods[
      random(methods)
    ];

    let text = "";

    if(t.type === "single"){

      text = t.text(a,method);

    }else{

      text = t.text(a,b);

    }

    result.push({

      text:text,

      debits:t.debits(method),

      credits:t.credits,

      explanation:t.explanation,

      category:t.category

    });

  }

  return result;

}

/* 出題 */

const selected =

wrongQuestions.length >= 10

? wrongQuestions.slice(0,10)

: generateQuestions(10);

/* 表示 */

const quiz =
document.getElementById("quiz");

selected.forEach((q,i)=>{

  quiz.innerHTML += `

  <div class="q">

    <h3>第${i+1}問</h3>

    <p>

      次の取引について
      最も適当な勘定科目を選択しなさい。

      <br><br>

      ${q.text}

    </p>

    <div class="journal-row">

      <div class="journal-side">

        <label>借方①</label>

        <select id="d1-${i}">

          <option value="">
          選択してください
          </option>

          ${accounts.map(a=>
          `<option>${a}</option>`
          ).join("")}

        </select>

      </div>

      <div class="journal-side">

        <label>貸方①</label>

        <select id="c1-${i}">

          <option value="">
          選択してください
          </option>

          ${accounts.map(a=>
          `<option>${a}</option>`
          ).join("")}

        </select>

      </div>

    </div>

    <div class="journal-row">

      <div class="journal-side">

        <label>借方②</label>

        <select id="d2-${i}">

          <option value="">
          選択してください
          </option>

          ${accounts.map(a=>
          `<option>${a}</option>`
          ).join("")}

        </select>

      </div>

      <div class="journal-side">

        <label>貸方②</label>

        <select id="c2-${i}">

          <option value="">
          選択してください
          </option>

          ${accounts.map(a=>
          `<option>${a}</option>`
          ).join("")}

        </select>

      </div>

    </div>

    <div id="r${i}"></div>

  </div>

  `;

});

/* 採点 */

function check(){

  let score = 0;

  selected.forEach((q,i)=>{

    const d1 =
    document.getElementById(`d1-${i}`).value;

    const d2 =
    document.getElementById(`d2-${i}`).value;

    const c1 =
    document.getElementById(`c1-${i}`).value;

    const c2 =
    document.getElementById(`c2-${i}`).value;

    const debitAnswers =
    [d1,d2].filter(v=>v);

    const creditAnswers =
    [c1,c2].filter(v=>v);

    const debitCorrect =
    q.debits.every(v=>
      debitAnswers.includes(v)
    );

    const creditCorrect =
    q.credits.every(v=>
      creditAnswers.includes(v)
    );

    const correct =
    debitCorrect &&
    creditCorrect;

    /* 履歴 */

    history.push({

      question:q.text,

      category:q.category,

      correct:correct,

      date:new Date()
      .toLocaleString()

    });

    /* 苦手保存 */

    if(!correct){

      wrongQuestions.push(q);

    }

    if(correct){

      score++;

      document.getElementById(
        `r${i}`
      ).innerHTML =

      `<div class="correct">

      ⭕ 正解

      <br><br>

      💡 解説<br>
      ${q.explanation}

      </div>`;

    }else{

      document.getElementById(
        `r${i}`
      ).innerHTML =

      `<div class="wrong">

      ❌ 正解<br><br>

      借方：
      ${q.debits.join(" ・ ")}

      <br><br>

      貸方：
      ${q.credits.join(" ・ ")}

      <br><br>

      💡 解説<br>
      ${q.explanation}

      </div>`;

    }

  });

  /* 保存 */

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );

  localStorage.setItem(
    "wrongQuestions",
    JSON.stringify(wrongQuestions)
  );

  /* 正答率 */

  const wrong =
  history.filter(
    h=>!h.correct
  ).length;

  const rate =
  (
    (
      history.length - wrong
    )
    /
    history.length
    *100
  ).toFixed(1);

  /* 苦手分析 */

  const categories = {};

  history.forEach(h=>{

    if(!categories[h.category]){

      categories[h.category] = {
        total:0,
        correct:0
      };

    }

    categories[h.category].total++;

    if(h.correct){

      categories[h.category].correct++;

    }

  });

  let analysis = "";

  for(let key in categories){

    const c = categories[key];

    const r =
    (
      c.correct
      /
      c.total
      *100
    ).toFixed(1);

    analysis += `
    ${key}：
    ${r}%<br>
    `;

  }

  document.getElementById(
    "score"
  ).innerHTML =

  `
  得点：${score}/${selected.length}

  <hr>

  履歴件数：
  ${history.length}件

  <br>

  累計正答率：
  ${rate}%

  <hr>

  <h3>苦手分析</h3>

  ${analysis}
  `;

}

/* 次の問題 */

function nextQuiz(){

  location.reload();

}