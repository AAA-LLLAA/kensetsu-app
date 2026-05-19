let history = JSON.parse(
  localStorage.getItem("history")
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

const expenses = [
  "通信費",
  "旅費交通費",
  "消耗品費",
  "水道光熱費"
];

/* テンプレ */

const templates = [

/* 単一仕訳 */

{

type:"single",

text:(a,m)=>
`${subjects[random(subjects)]} ${a.toLocaleString()}円 を ${m} で受け取った。`,

debits:(m)=>[m],

credits:["完成工事高"]

},

{

type:"single",

text:(a)=>
`${materials[random(materials)]} ${a.toLocaleString()}円 を掛けで購入した。`,

debits:()=>["材料貯蔵品"],

credits:["買掛金"]

},

{

type:"single",

text:(a)=>
`工事進行基準により ${a.toLocaleString()}円 の収益を計上した。`,

debits:()=>["完成工事未収入金"],

credits:["完成工事高"]

},

{

type:"single",

text:(a)=>
`完成工事に対応する工事原価 ${a.toLocaleString()}円 を振り替えた。`,

debits:()=>["完成工事原価"],

credits:["未成工事支出金"]

},

/* 複合仕訳 */

{

type:"multi",

text:(a,b)=>
`${materials[random(materials)]} ${a.toLocaleString()}円 を掛けで購入し、運搬費 ${b.toLocaleString()}円 を現金で支払った。`,

debits:()=>["材料貯蔵品","通信費"],

credits:["買掛金","現金"]

},

{

type:"multi",

text:(a,b)=>
`工事未払金 ${a.toLocaleString()}円 を当座預金で支払い、手数料 ${b.toLocaleString()}円 を現金で支払った。`,

debits:()=>["工事未払金","通信費"],

credits:["当座預金","現金"]

},

{

type:"multi",

text:(a,b)=>
`工事用消耗品 ${a.toLocaleString()}円 を現金で購入し、水道光熱費 ${b.toLocaleString()}円 を普通預金から支払った。`,

debits:()=>["消耗品費","水道光熱費"],

credits:["現金","普通預金"]

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

/* AI問題生成 */

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

    result.push({

      text:t.text(a,b,method),

      debits:t.debits(method),

      credits:t.credits

    });

  }

  return result;

}

/* 10問生成 */

const selected =
generateQuestions(10);

/* 問題表示 */

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

    <label>借方①</label>

    <select id="d1-${i}">
      <option value="">選択してください</option>

      ${accounts.map(a=>
      `<option>${a}</option>`
      ).join("")}

    </select>

    <label>借方②</label>

    <select id="d2-${i}">
      <option value="">選択してください</option>

      ${accounts.map(a=>
      `<option>${a}</option>`
      ).join("")}

    </select>

    <label>貸方①</label>

    <select id="c1-${i}">
      <option value="">選択してください</option>

      ${accounts.map(a=>
      `<option>${a}</option>`
      ).join("")}

    </select>

    <label>貸方②</label>

    <select id="c2-${i}">
      <option value="">選択してください</option>

      ${accounts.map(a=>
      `<option>${a}</option>`
      ).join("")}

    </select>

    <div id="r${i}"></div>

  </div>

  `;

});

/* 採点 */

function check(){

  let score = 0;

  selected.forEach((q,i)=>{

    const d1 =
    document.getElementById(
      `d1-${i}`
    ).value;

    const d2 =
    document.getElementById(
      `d2-${i}`
    ).value;

    const c1 =
    document.getElementById(
      `c1-${i}`
    ).value;

    const c2 =
    document.getElementById(
      `c2-${i}`
    ).value;

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

      correct:correct,

      date:new Date()
      .toLocaleString()

    });

    if(correct){

      score++;

      document.getElementById(
        `r${i}`
      ).innerHTML =

      `<div class="correct">
      ⭕ 正解
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

      </div>`;

    }

  });

  /* 保存 */

  localStorage.setItem(
    "history",
    JSON.stringify(history)
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
  `;

}

/* 次の問題 */

function nextQuiz(){

  location.reload();

}