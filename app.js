/* =========================
   履歴
========================= */

let history = JSON.parse(
  localStorage.getItem("history")
) || [];

let wrongQuestions = JSON.parse(
  localStorage.getItem("wrongQuestions")
) || [];

/* =========================
   勘定科目
========================= */

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

/* =========================
   AI用単語
========================= */

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

/* =========================
   問題テンプレ
========================= */

const templates = [

{

category:"収益",

type:"single",

text:(a,m)=>
`${subjects[random(subjects)]}
${a.toLocaleString()}円 を
${m} で受け取った。`,

debits:(m)=>[m],

credits:["完成工事高"],

explanation:
"完成工事代金を受け取ったため収益計上する。"

},

{

category:"材料",

type:"single",

text:(a)=>
`${materials[random(materials)]}
${a.toLocaleString()}円 を
掛けで購入した。`,

debits:()=>["材料"],

credits:["工事未払金"],

explanation:
"掛け購入のため工事未払金が発生する。"

},

{

category:"進行基準",

type:"single",

text:(a)=>
`工事進行基準により
${a.toLocaleString()}円 の
収益を計上した。`,

debits:()=>["完成工事未収入金"],

credits:["完成工事高"],

explanation:
"工事進行基準では進捗に応じて収益計上する。"

},

{

category:"複合",

type:"multi",

text:(a,b)=>
`${materials[random(materials)]}
${a.toLocaleString()}円 を
掛けで購入し、

運搬費
${b.toLocaleString()}円 を
現金で支払った。`,

debits:()=>["材料","通信費"],

credits:["工事未払金","現金"],

explanation:
"材料購入と運搬費支払を同時に処理する複合仕訳。"

}

];

/* =========================
   ランダム
========================= */

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

/* =========================
   問題生成
========================= */

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

/* =========================
   出題
========================= */

const selected =

wrongQuestions.length >= 10

? wrongQuestions.slice(0,10)

: generateQuestions(10);

/* =========================
   検索付きセレクト
========================= */

function createSelect(id){

  return `

  <input
  type="text"
  class="search-box"
  placeholder="勘定科目検索"
  onkeyup="filterOptions('${id}',this.value)"
  >

  <select id="${id}">

    <option value="">
    選択してください
    </option>

    ${accounts.map(a=>
    `<option>${a}</option>`
    ).join("")}

  </select>

  `;

}

/* =========================
   表示
========================= */

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

        ${createSelect(`d1-${i}`)}

      </div>

      <div class="journal-side">

        <label>貸方①</label>

        ${createSelect(`c1-${i}`)}

      </div>

    </div>

    <div class="journal-row">

      <div class="journal-side">

        <label>借方②</label>

        ${createSelect(`d2-${i}`)}

      </div>

      <div class="journal-side">

        <label>貸方②</label>

        ${createSelect(`c2-${i}`)}

      </div>

    </div>

    <div id="r${i}"></div>

  </div>

  `;

});

/* =========================
   検索
========================= */

function filterOptions(id,keyword){

  const select =
  document.getElementById(id);

  const lower =
  keyword.toLowerCase();

  select.innerHTML = `
  <option value="">
  選択してください
  </option>
  `;

  accounts
  .filter(a=>
    a.toLowerCase().includes(lower)
  )
  .forEach(a=>{

    select.innerHTML +=
    `<option>${a}</option>`;

  });

}

/* =========================
   採点
========================= */

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

    history.push({

      question:q.text,

      category:q.category,

      correct:correct,

      date:new Date()
      .toLocaleString()

    });

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

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );

  localStorage.setItem(
    "wrongQuestions",
    JSON.stringify(wrongQuestions)
  );

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

/* =========================
   次の問題
========================= */

function nextQuiz(){

  location.reload();

}