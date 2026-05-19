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
  "水道光熱費"

];

/* 問題用単語 */

const subjects = [
  "完成した工事代金",
  "請負工事代金",
  "完成工事代金"
];

const receiveMethods = [
  "現金",
  "当座預金"
];

const materialTargets = [
  "工事現場で使用する材料",
  "工事用材料",
  "現場材料"
];

/* AI風テンプレ */

const templates = [

{
  type:"receive",

  text:(a,m)=>
  `${subjects[Math.floor(Math.random()*subjects.length)]} ${a.toLocaleString()}円 を ${m} で受け取った。`,

  debit:(m)=>m,

  credit:"完成工事高"
},

{
  type:"material",

  text:(a)=>
  `${materialTargets[Math.floor(Math.random()*materialTargets.length)]} ${a.toLocaleString()}円 を掛けで購入した。`,

  debit:"材料貯蔵品",

  credit:"買掛金"
},

{
  type:"progress",

  text:(a)=>
  `工事進行基準により ${a.toLocaleString()}円 の収益を計上した。`,

  debit:"完成工事未収入金",

  credit:"完成工事高"
},

{
  type:"cost",

  text:(a)=>
  `完成工事に対応する工事原価 ${a.toLocaleString()}円 を振り替えた。`,

  debit:"完成工事原価",

  credit:"未成工事支出金"
},

{
  type:"advance",

  text:(a)=>
  `工事着手前に前受金 ${a.toLocaleString()}円 を受け取った。`,

  debit:"現金",

  credit:"未成工事受入金"
},

{
  type:"payment",

  text:(a)=>
  `工事未払金 ${a.toLocaleString()}円 を当座預金から支払った。`,

  debit:"工事未払金",

  credit:"当座預金"
},

{
  type:"depreciation",

  text:(a)=>
  `工事用機械の減価償却費 ${a.toLocaleString()}円 を計上した。`,

  debit:"減価償却費",

  credit:"機械装置"
}

];

/* ランダム金額 */

function randomAmount(){

  return Math.floor(
    Math.random()*900+100
  ) * 1000;

}

/* AI問題生成 */

function generateQuestions(num){

  const result = [];

  for(let i=0;i<num;i++){

    const t = templates[
      Math.floor(Math.random()*templates.length)
    ];

    const amount = randomAmount();

    if(t.type === "receive"){

      const method =
      receiveMethods[
        Math.floor(
          Math.random()*receiveMethods.length
        )
      ];

      result.push({

        text:t.text(amount,method),

        debit:t.debit(method),

        credit:t.credit

      });

    }else{

      result.push({

        text:t.text(amount),

        debit:t.debit,

        credit:t.credit

      });

    }

  }

  return result;

}

/* 10問生成 */

const selected = generateQuestions(10);

/* 問題表示 */

const quiz =
document.getElementById("quiz");

selected.forEach((q,i)=>{

  quiz.innerHTML += `

  <div class="q">

    <h3>第${i+1}問</h3>

    <p>
      次の取引について
      最も適当な勘定科目を選択しなさい。<br><br>

      ${q.text}
    </p>

    <label>借方</label>

    <select id="d${i}">

      <option value="">選択してください</option>

      ${accounts.map(a=>
      `<option>${a}</option>`
      ).join("")}

    </select>

    <label>貸方</label>

    <select id="c${i}">

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

    const d =
    document.getElementById(
      "d"+i
    ).value;

    const c =
    document.getElementById(
      "c"+i
    ).value;

    const correct =
    (d===q.debit && c===q.credit);

    /* 履歴保存 */

    history.push({

      question:q.text,

      correct:correct,

      date:new Date()
      .toLocaleString()

    });

    if(correct){

      score++;

      document.getElementById(
        "r"+i
      ).innerHTML =

      `<div class="correct">
      ⭕ 正解
      </div>`;

    }else{

      document.getElementById(
        "r"+i
      ).innerHTML =

      `<div class="wrong">
      ❌ 正解：
      ${q.debit}
      ／
      ${q.credit}
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