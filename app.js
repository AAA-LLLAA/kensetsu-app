const accounts = [

"現金",
"小口現金",
"当座預金",
"普通預金",
"通知預金",
"定期預金",
"別段預金",
"受取手形",
"完成工事未収入金",
"有価証券",
"未成工事支出金",
"材料",
"貯蔵品",
"前渡金",
"貸付金",
"手形貸付金",
"前払保険料",
"前払地代",
"前払家賃",
"前払利息",
"未収家賃",
"未収利息",
"未収手数料",
"営業外受取手形",
"未収入金",
"立替金",
"仮払金",
"仮払法人税等",
"仮払消費税",
"未収消費税",
"貸倒引当金",
"建物",
"構築物",
"機械装置",
"船舶",
"車両運搬具",
"工具器具",
"備品",
"減価償却累計額",
"土地",
"建設仮勘定",
"のれん",
"特許権",
"借地権",
"実用新案権",
"電話加入権",
"施設利用権",
"投資有価証券",
"出資金",
"長期貸付金",
"破産債権、更生債権等",
"不渡手形",
"長期前払費用",
"差入保証金",
"差入有価証券",
"株式交付費",
"社債発行費",
"支払手形",
"工事未払金",
"借入金",
"手形借入金",
"当座借越",
"未払金",
"未払地代",
"未払家賃",
"未払利息",
"未払配当金",
"未払法人税等",
"未成工事受入金",
"預り金",
"前受家賃",
"前受地代",
"前受利息",
"仮受金",
"仮受消費税",
"未払消費税",
"賞与引当金",
"修繕引当金",
"完成工事補償引当金",
"営業外支払手形",
"社債",
"長期借入金",
"長期未払金",
"退職給付引当金",
"保証債務",
"資本金",
"受取利息",
"完成工事高",
"受取配当金",
"雑収入",
"完成工事原価",
"給料手当",
"法定福利費",
"福利厚生費",
"通信費",
"旅費交通費",
"水道光熱費",
"交際費",
"支払家賃",
"減価償却費",
"租税公課",
"保険料",
"雑費",
"支払利息",
"材料費",
"労務費",
"外注費",
"経費"

];

/* ランダム */

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

/* 問題テンプレ */

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

},

{

text:(a,b)=>
`社債
${a.toLocaleString()}円を
発行し、
発行費
${b.toLocaleString()}円を
現金で支払った。`,

debit:[
  {
    account:"現金",
    amount:a-b
  },
  {
    account:"社債発行費",
    amount:b
  }
],

credit:[
  {
    account:"社債",
    amount:a
  }
],

explanation:
"社債発行費は区分処理する。"

},

{

text:(a,b)=>
`営業用車両を
${a.toLocaleString()}円で購入し、
代金のうち
${b.toLocaleString()}円は
現金で支払い、
残額は未払金とした。`,

debit:[
  {
    account:"車両運搬具",
    amount:a
  }
],

credit:[
  {
    account:"現金",
    amount:b
  },
  {
    account:"未払金",
    amount:a-b
  }
],

explanation:
"固定資産購入時の複合仕訳。"

}

];

/* 問題生成 */

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

/* 必須勘定抽出 */

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

/* 24科目までランダム */

while(required.length < 24){

  const r =
  accounts[
    rand(accounts.length)
  ];

  if(!required.includes(r)){

    required.push(r);

  }

}

/* シャッフル */

required.sort(
()=>Math.random()-0.5
);

/* A〜X */

const letters =
"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
.split("");

const mapping = {};

required.forEach((a,i)=>{

  mapping[
    letters[i]
  ] = a;

});

/* 勘定科目表示 */

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

/* 問題表示 */

const quiz =
document.getElementById(
"quiz"
);

questions.forEach((q,i)=>{

  const debit2 =
  q.debit[1] || {
    account:"",
    amount:""
  };

  const credit2 =
  q.credit[1] || {
    account:"",
    amount:""
  };

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

    <div class="answer-row">

      <span>借方</span>

      <input
      type="text"
      maxlength="1"
      id="d2-${i}"
      >

      <input
      type="number"
      id="da2-${i}"
      >

      <span>貸方</span>

      <input
      type="text"
      maxlength="1"
      id="c2-${i}"
      >

      <input
      type="number"
      id="ca2-${i}"
      >

    </div>

    <div id="r${i}"></div>

  </div>

  `;

});

/* 判定 */

function judge(letter,account){

  if(account === ""){

    return true;

  }

  return mapping[letter]
  === account;

}

/* 採点 */

function check(){

  let score = 0;

  questions.forEach((q,i)=>{

    const d1 =
    document
    .getElementById(`d1-${i}`)
    .value
    .toUpperCase();

    const d2 =
    document
    .getElementById(`d2-${i}`)
    .value
    .toUpperCase();

    const c1 =
    document
    .getElementById(`c1-${i}`)
    .value
    .toUpperCase();

    const c2 =
    document
    .getElementById(`c2-${i}`)
    .value
    .toUpperCase();

    const da1 =
    Number(
      document
      .getElementById(`da1-${i}`)
      .value
    );

    const da2 =
    Number(
      document
      .getElementById(`da2-${i}`)
      .value
    );

    const ca1 =
    Number(
      document
      .getElementById(`ca1-${i}`)
      .value
    );

    const ca2 =
    Number(
      document
      .getElementById(`ca2-${i}`)
      .value
    );

    const debit2 =
    q.debit[1] || {
      account:"",
      amount:0
    };

    const credit2 =
    q.credit[1] || {
      account:"",
      amount:0
    };

    const correct =

    judge(
      d1,
      q.debit[0].account
    )

    &&

    judge(
      d2,
      debit2.account
    )

    &&

    judge(
      c1,
      q.credit[0].account
    )

    &&

    judge(
      c2,
      credit2.account
    )

    &&

    da1
    ===
    q.debit[0].amount

    &&

    da2
    ===
    debit2.amount

    &&

    ca1
    ===
    q.credit[0].amount

    &&

    ca2
    ===
    credit2.amount;

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
      ${q.debit.map(v=>
      `${v.account}
      ${v.amount.toLocaleString()}`
      ).join(" ／ ")}

      <br><br>

      貸方：
      ${q.credit.map(v=>
      `${v.account}
      ${v.amount.toLocaleString()}`
      ).join(" ／ ")}

      <br><br>

      ${q.explanation}

      </div>`;

    }

  });

  document
  .getElementById("score")
  .innerHTML =

  `得点：
  ${score}/5`;

}

/* 次の問題 */

function nextQuiz(){

  location.reload();

}