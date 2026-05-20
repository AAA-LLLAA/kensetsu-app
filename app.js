window.onload = function(){

/* =========================
   勘定科目
========================= */

const accounts = [

"現金",
"当座預金",
"普通預金",
"完成工事未収入金",
"未成工事支出金",
"材料",
"工事未払金",
"未成工事受入金",
"完成工事高",
"完成工事原価",
"通信費",
"旅費交通費",
"水道光熱費",
"租税公課",
"支払利息",
"受取配当金",
"広告宣伝費",
"社債",
"当座借越",
"有価証券",
"営業外受取手形",
"営業外支払手形",
"未払法人税等",
"預り金",
"土地",
"支払手数料",
"社債発行費",
"仮払金",
"未払金",
"減価償却費",
"保険料",
"雑費",
"労務費",
"外注費",
"材料費",
"経費"

];

/* =========================
   ランダム
========================= */

function rand(max){

  return Math.floor(
    Math.random()*max
  );

}

function amount(){

  return Math.floor(
    (Math.random()*900+100)
  ) * 1000;

}

/* =========================
   問題テンプレ
========================= */

const templates = [

{

text:(a,b)=>
`完成工事に係る請負代金
${a.toLocaleString()}円のうち、
${b.toLocaleString()}円が
当座預金口座へ振り込まれ、
残額は完成工事未収入金
とした。`,

debit:[
  {
    account:"当座預金",
    amount:b
  },
  {
    account:"完成工事未収入金",
    amount:a-b
  }
],

credit:[
  {
    account:"完成工事高",
    amount:a
  }
],

explanation:
"入金分は当座預金、残額は完成工事未収入金。"

},

{

text:(a,b)=>
`工事用材料
${a.toLocaleString()}円を
掛けで購入し、
運搬費
${b.toLocaleString()}円を
現金で支払った。`,

debit:[
  {
    account:"材料",
    amount:a
  },
  {
    account:"通信費",
    amount:b
  }
],

credit:[
  {
    account:"工事未払金",
    amount:a
  },
  {
    account:"現金",
    amount:b
  }
],

explanation:
"材料購入と運搬費支払の複合仕訳。"

}

];

/* =========================
   問題生成
========================= */

const questions = [];

for(let i=0;i<5;i++){

  const t =
  templates[
    rand(templates.length)
  ];

  const a = amount();

  const b =
  Math.floor(a*0.4);

  questions.push({

    text:t.text(a,b),

    debit:t.debit,

    credit:t.credit,

    explanation:t.explanation

  });

}

/* =========================
   必須勘定
========================= */

let required = [];

questions.forEach(q=>{

  q.debit.forEach(d=>{

    required.push(
      d.account
    );

  });

  q.credit.forEach(c=>{

    required.push(
      c.account
    );

  });

});

required =
[...new Set(required)];

/* =========================
   24科目
========================= */

while(required.length < 24){

  const r =
  accounts[
    rand(accounts.length)
  ];

  if(!required.includes(r)){

    required.push(r);

  }

}

/* =========================
   シャッフル
========================= */

required.sort(
()=>Math.random()-0.5
);

/* =========================
   A〜X
========================= */

const letters = [

"A","B","C","D","E","F",
"G","H","I","J","K","L",
"M","N","O","P","Q","R",
"S","T","U","V","W","X"

];

const mapping = {};

required.forEach((a,i)=>{

  mapping[
    letters[i]
  ] = a;

});

/* =========================
   勘定科目表示
========================= */

const accountList =
document.getElementById(
"account-list"
);

required.forEach((a,i)=>{

  accountList.innerHTML += `

  <div class="account-item">

    <b>${letters[i]}</b>

    ${a}

  </div>

  `;

});

/* =========================
   問題表示
========================= */

const quiz =
document.getElementById(
"quiz"
);

questions.forEach((q,i)=>{

  quiz.innerHTML += `

  <div class="q">

    <h3>
    第${i+1}問
    </h3>

    <p>
    ${q.text}
    </p>

    <div class="answer-row">

      <span>借方</span>

      <input
      type="text"
      maxlength="1"
      id="d1-${i}"
      >

      <input
      type="number"
      id="da1-${i}"
      >

      <span>貸方</span>

      <input
      type="text"
      maxlength="1"
      id="c1-${i}"
      >

      <input
      type="number"
      id="ca1-${i}"
      >

    </div>

    <div id="r${i}"></div>

  </div>

  `;

});

/* =========================
   採点
========================= */

window.check = function(){

  let score = 0;

  questions.forEach((q,i)=>{

    const d1 =
    document
    .getElementById(`d1-${i}`)
    .value
    .toUpperCase();

    const c1 =
    document
    .getElementById(`c1-${i}`)
    .value
    .toUpperCase();

    const da1 =
    Number(
      document
      .getElementById(`da1-${i}`)
      .value
    );

    const ca1 =
    Number(
      document
      .getElementById(`ca1-${i}`)
      .value
    );

    const correct =

    mapping[d1]
    ===
    q.debit[0].account

    &&

    mapping[c1]
    ===
    q.credit[0].account

    &&

    da1
    ===
    q.debit[0].amount

    &&

    ca1
    ===
    q.credit[0].amount;

    if(correct){

      score++;

      document
      .getElementById(`r${i}`)
      .innerHTML =

      `<div class="correct">

      ⭕ 正解

      <br><br>

      ${q.explanation}

      </div>`;

    }else{

      document
      .getElementById(`r${i}`)
      .innerHTML =

      `<div class="wrong">

      ❌ 不正解

      <br><br>

      借方：
      ${q.debit[0].account}
      ${q.debit[0].amount.toLocaleString()}

      <br><br>

      貸方：
      ${q.credit[0].account}
      ${q.credit[0].amount.toLocaleString()}

      </div>`;

    }

  });

  document
  .getElementById("score")
  .innerHTML =

  `得点：${score}/5`;

}

/* =========================
   次の問題
========================= */

window.nextQuiz = function(){

  location.reload();

}

}