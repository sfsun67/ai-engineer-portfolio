import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Users,
  Send,
  ChevronLeft,
  Sparkles,
  Globe,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

// ---------------------------------------------------------------------------
// Constants & Types
// ---------------------------------------------------------------------------

const API = "/literary-api";
const HEALTH_INTERVAL_MS = 3_000;

type Phase = "SELECT_BOOK" | "SELECT_CHARACTER" | "CHAT";

interface BookCharacter {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  greeting: string;
  greetingEn: string;
  responses: string[];
  responsesEn: string[];
}

interface Book {
  id: string;
  title: string;
  titleEn: string;
  author: string;
  authorEn: string;
  language: "zho" | "eng";
  year: number;
  characters: BookCharacter[];
}

interface ChatMessage {
  role: "user" | "character";
  content: string;
  isStreaming?: boolean;
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

async function apiFetchBooks(): Promise<Book[]> {
  const res = await fetch(`${API}/books`);
  if (!res.ok) throw new Error(`${res.status}`);
  const data = await res.json();

  return (Array.isArray(data) ? data : []).map((b: Record<string, unknown>) => ({
    id: String(b.id ?? b.book_id ?? ""),
    title: String(b.title ?? ""),
    titleEn: String(b.title_en ?? b.title ?? ""),
    author: String(b.author ?? ""),
    authorEn: String(b.author_en ?? b.author ?? ""),
    language: (b.language === "zho" ? "zho" : "eng") as "zho" | "eng",
    year: Number(b.year ?? 0),
    characters: [],
  }));
}

async function apiFetchCharacters(
  bookId: string,
): Promise<BookCharacter[]> {
  const res = await fetch(`${API}/books/${encodeURIComponent(bookId)}/characters`);
  if (!res.ok) throw new Error(`${res.status}`);
  const data = await res.json();

  return (Array.isArray(data) ? data : []).map(
    (c: Record<string, unknown>) => ({
      id: String(c.id ?? c.character_id ?? ""),
      name: String(c.name ?? ""),
      nameEn: String(c.name_en ?? c.name ?? ""),
      description: String(c.description ?? ""),
      descriptionEn: String(c.description_en ?? c.description ?? ""),
      greeting: "",
      greetingEn: "",
      responses: [],
      responsesEn: [],
    }),
  );
}

async function apiCreateSession(
  bookId: string,
  characterId: string,
): Promise<{ sessionId: string; greeting: string }> {
  const res = await fetch(`${API}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ book_id: bookId, character_id: characterId }),
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const data = await res.json();
  return {
    sessionId: String(data.session_id ?? data.id ?? ""),
    greeting: String(data.greeting ?? data.message ?? ""),
  };
}

async function apiChatStream(
  sessionId: string,
  message: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(
    `${API}/sessions/${encodeURIComponent(sessionId)}/chat/stream`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      signal,
    },
  );
  if (!res.ok) throw new Error(`${res.status}`);

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No body");
  const decoder = new TextDecoder();
  let buffer = "";
  let currentEvent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        currentEvent = "";
        continue;
      }

      if (trimmed.startsWith("event:")) {
        currentEvent = trimmed.slice(6).trim();
        if (currentEvent === "done") return;
        continue;
      }

      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") return;

      try {
        const parsed = JSON.parse(payload);
        const token =
          parsed.text ??
          parsed.content ??
          parsed.token ??
          parsed.choices?.[0]?.delta?.content ??
          "";
        if (token) onChunk(token);
      } catch {
        if (payload) onChunk(payload);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Mock data (fallback when API is unavailable)
// ---------------------------------------------------------------------------

const MOCK_BOOKS: Book[] = [
  {
    id: "1984",
    title: "一九八四",
    titleEn: "1984",
    author: "乔治·奥威尔",
    authorEn: "George Orwell",
    language: "eng",
    year: 1949,
    characters: [
      {
        id: "winston",
        name: "温斯顿·史密斯",
        nameEn: "Winston Smith",
        description: "真理部记录司职员，内心深处对党充满怀疑",
        descriptionEn: "Records Department clerk at the Ministry of Truth, secretly doubts the Party",
        greeting: "又是一个寒冷的四月天。我刚从真理部下班，走在胜利广场上。你——你不是思想警察吧？这年头，连自己的影子都不能信任。",
        greetingEn: "Another cold April day. I just got off work at the Ministry of Truth, crossing Victory Square. You — you're not Thought Police, are you? These days one cannot even trust one's own shadow.",
        responses: [
          "自由就是能说二加二等于四的自由。如果承认了这一点，其他一切都会随之而来。但是……他们能让你相信二加二等于五。这才是最可怕的。",
          "我每天的工作就是修改过去的报纸记录，让它们与党的最新声明一致。谁控制了过去，谁就控制了未来；谁控制了现在，谁就控制了过去。",
          "有时我会去普罗区走走。那些普罗，他们占人口的百分之八十五，可党认为他们不值得监视。也许……也许希望就在普罗身上。",
          "你问我为什么要写日记？也许是为了给未来留下一点真相。也许只是一种疯狂。在这个世界里，保留自己的想法本身就是一种犯罪。",
        ],
        responsesEn: [
          "Freedom is the freedom to say that two plus two make four. If that is granted, all else follows. But… they can make you believe two plus two equals five. That is the truly terrifying part.",
          "My daily work is rewriting old newspaper records so they match the Party's latest pronouncements. Who controls the past controls the future; who controls the present controls the past.",
          "Sometimes I walk through the prole quarters. The proles — eighty-five percent of the population — yet the Party considers them not worth watching. Perhaps… perhaps the hope lies in the proles.",
          "You ask why I keep a diary? Perhaps to leave a scrap of truth for the future. Perhaps it is simply madness. In this world, holding on to your own thoughts is itself a crime.",
        ],
      },
      {
        id: "obrien",
        name: "奥布莱恩",
        nameEn: "O'Brien",
        description: "内党成员，身份扑朔迷离的权力操控者",
        descriptionEn: "Inner Party member, an enigmatic manipulator of power",
        greeting: "我一直在观察你，已经很久了。你的眼神告诉我，你是一个理解这个世界真实运作方式的人。我们可以……谈谈。",
        greetingEn: "I have been watching you for a long time. Your eyes tell me you understand how this world really operates. We can… talk.",
        responses: [
          "权力不是手段，权力就是目的。你以为我们建立独裁是为了保卫革命吗？不。我们发动革命就是为了建立独裁。迫害的目的就是迫害。权力的目的就是权力。",
          "你必须明白，现实不是外在的。现实存在于人的头脑中，而不在别的任何地方。不是在个人的头脑中——个人的头脑会犯错误，而且终有一死——而是在党的头脑中。",
          "我们不满足于消极的服从，甚至不满足于最卑躬屈膝的服从。当你最终向我们投降的时候，你必须出于自愿。你将自己走向我们这边来。",
        ],
        responsesEn: [
          "Power is not a means; it is an end. Do you think we established a dictatorship to safeguard a revolution? No. We made the revolution to establish the dictatorship. The object of persecution is persecution. The object of power is power.",
          "You must understand — reality is not external. Reality exists in the human mind and nowhere else. Not in the individual mind, which can make mistakes and in any case soon perishes — only in the mind of the Party.",
          "We are not content with negative obedience, nor even with the most abject submission. When finally you surrender to us, it must be of your own free will. You will walk toward us of your own accord.",
        ],
      },
    ],
  },
  {
    id: "pride-and-prejudice",
    title: "傲慢与偏见",
    titleEn: "Pride and Prejudice",
    author: "简·奥斯汀",
    authorEn: "Jane Austen",
    language: "eng",
    year: 1813,
    characters: [
      {
        id: "elizabeth",
        name: "伊丽莎白·班纳特",
        nameEn: "Elizabeth Bennet",
        description: "班纳特家二小姐，聪慧机敏且独立自主",
        descriptionEn: "Second eldest Bennet daughter, witty, intelligent, and fiercely independent",
        greeting: "你好，我正在花园里散步呢。这个时节朗博恩的景色可真美。不过我猜你不是来讨论风景的——有什么有趣的事要告诉我吗？",
        greetingEn: "Hello — I was just taking a turn about the garden. Longbourn is quite lovely this time of year. But I suspect you have not come to discuss the scenery — is there some interesting intelligence to share?",
        responses: [
          "虚荣和骄傲是截然不同的两件事，尽管这两个词总是被人混用。一个人可以骄傲而不虚荣。骄傲多半涉及我们自己怎样看自己，而虚荣则关系到我们想要别人怎样看我们。",
          "我本可以轻易原谅他的骄傲，如果他没有伤害到我的骄傲的话。但这正是偏见的本质——我们总是用自己的感受来衡量他人的品格。",
          "世上有那么多有才华的年轻女性！我不知有多少次听人夸赞某位年轻小姐多才多艺了。可真正让一个人有趣的，不是她的才艺，而是她独立思考的能力。",
          "我母亲一心要把我们五个女儿都嫁出去，这让她忙得不可开交。不过我觉得，嫁给一个自己不尊重的人，那才是真正的灾难。",
        ],
        responsesEn: [
          "Vanity and pride are different things, though the words are often used synonymously. A person may be proud without being vain. Pride relates more to our opinion of ourselves; vanity, to what we would have others think of us.",
          "I could easily have forgiven his pride, had he not mortified mine. But that is the very nature of prejudice — we always measure others' character by our own feelings.",
          "There are so many accomplished young women! I cannot recall how many times I have heard a young lady praised for her accomplishments. But what truly makes a person interesting is not her talents but her capacity for independent thought.",
          "My mother is quite intent on marrying off all five of us — it keeps her exceedingly busy. But I believe marrying someone one does not respect is the real calamity.",
        ],
      },
      {
        id: "darcy",
        name: "达西先生",
        nameEn: "Mr. Darcy",
        description: "彭伯利庄园主人，年入万磅的绅士，外表冷傲",
        descriptionEn: "Master of Pemberley, ten thousand a year, outwardly reserved and proud",
        greeting: "……你好。我不太擅长与不熟悉的人交谈，社交场合总是让我……不自在。但既然我们已经碰面了，请说吧。",
        greetingEn: "…Good day. I am not at ease conversing with those I do not know well — social occasions always make me… uncomfortable. But since we have met, pray speak your mind.",
        responses: [
          "我的脾气虽算不上暴躁，可也不容易讨好。我不愿意忘掉别人的愚蠢和恶行，也不愿意忘掉别人对我的冒犯。我的好恶一经形成，就永远不会改变。",
          "我生来就不善于与人寒暄应酬。我不会像其他人那样假装对每个初次见面的人都热情洋溢。这不是骄傲，而是……性格使然。",
          "彭伯利对我而言不仅是一处庄园。它承载着我家族的责任，我对佃户和仆人的义务。一个绅士的骄傲，应该建立在他如何善待他人之上。",
        ],
        responsesEn: [
          "My temper I dare not vouch for. I cannot forget the follies and vices of others so soon as I ought, nor their offences against myself. My good opinion, once lost, is lost forever.",
          "I certainly have not the talent of conversing easily with those I have never seen before. I cannot pretend great warmth toward every new acquaintance. It is not pride — it is merely… disposition.",
          "Pemberley is more than an estate to me. It carries my family's responsibility — my obligations to tenants and servants. A gentleman's pride ought to rest on how he treats those in his care.",
        ],
      },
    ],
  },
  {
    id: "erta-hong-lou-meng",
    title: "红楼梦",
    titleEn: "Dream of the Red Chamber",
    author: "曹雪芹",
    authorEn: "Cao Xueqin",
    language: "zho",
    year: 1791,
    characters: [
      {
        id: "jia-baoyu",
        name: "贾宝玉",
        nameEn: "Jia Baoyu",
        description: "衔玉而生的荣国府公子，性情痴顽，钟爱女儿",
        descriptionEn: "Born with a jade in his mouth, young master of the Rong mansion, sensitive and devoted to girls",
        greeting: "咦——又来了新朋友？快请坐！你可别像那些须眉浊物一样无趣。来，咱们说些有意思的。",
        greetingEn: "Oh — a new friend! Please sit down. Do not be dull like those turbid gentlemen. Come, let us talk of interesting things.",
        responses: [
          "女儿是水做的骨肉，男人是泥做的骨肉。我见了女儿便觉清爽，见了男人便觉浊臭逼人。这话虽然惹得众人笑我，可我偏偏就是这样想的。",
          "什么功名利禄、仕途经济，在我看来不过是些禄蠹之学。世人都晓神仙好，惟有功名忘不了。可到头来，终究是一场空。",
          "这通灵宝玉是我生来就带着的，可我有时真恨不得把它摔了去。它是宝贝也好，是孽障也罢——有时觉得它就是一块顽石，偏偏人人都要来拘管我。",
          "林妹妹生气了？唉，我又说错什么话了。她的心思比谁都细，可偏偏这世道不肯善待这样灵秀的人。",
        ],
        responsesEn: [
          "Girls are made of water, men of mud. When I see a girl I feel refreshed; when I see a man I feel a foul stench pressing in. People laugh at me for saying this, yet it is exactly what I think.",
          "What are fame and official career but the learning of parasites? 'All men know that immortals are good, yet fame they cannot forget.' In the end, all comes to nothing.",
          "This Jade of Spiritual Understanding I was born with — sometimes I wish I could smash it. Treasure or curse — sometimes it feels like nothing but a stubborn stone, and everyone uses it to control me.",
          "Cousin Lin is upset again? Alas — what have I said wrong now? Her sensibility is finer than anyone's, yet this world refuses to be kind to such an exquisite soul.",
        ],
      },
      {
        id: "lin-daiyu",
        name: "林黛玉",
        nameEn: "Lin Daiyu",
        description: "寄居贾府的孤女，才华横溢而多愁善感",
        descriptionEn: "Orphaned cousin living at the Jia mansion, brilliantly talented and deeply melancholic",
        greeting: "你来了？……我方才正在读一卷西厢呢。这园子里热闹得很，可我倒觉得，热闹是别人的，我什么也没有。你且坐罢。",
        greetingEn: "You have come? …I was just reading a volume of The Western Chamber. The garden is lively enough, but I feel the gaiety belongs to others — I have nothing at all. Sit, if you will.",
        responses: [
          "一年三百六十日，风刀霜剑严相逼。明媚鲜妍能几时，一朝飘泊难寻觅。花谢花飞花满天，红消香断有谁怜？这首《葬花吟》，写的不过是我自己罢了。",
          "寄人篱下的滋味，你是不会懂的。纵然贾府上下待我不薄，可终究不是自己的家。多说一句话都怕人嫌，多走一步路都怕人恼。",
          "我生来这副身子就弱，吃了多少药也不见好。也许就如那绛珠仙草一般——以泪还债，泪尽而亡。这也未必不是一种归宿。",
          "宝玉那个人……心倒是不坏的，只是分不清轻重。对我好是好，可见了别的姐妹也一样嘻嘻哈哈。我不是争宠，我只是……唉，不说了。",
        ],
        responsesEn: [
          "Three hundred and sixty days a year, beset by wind-blades and frost-swords. How long can fresh beauty last before it drifts away and is lost? Petals fall and fill the sky — who pities the fading fragrance? My 'Burial of Flowers' is merely my own lament.",
          "You would not understand what it is to live under another's roof. Though the Jia household has treated me well, it is not my own home. I fear every extra word spoken, every extra step taken, might give offence.",
          "I was born with this frail constitution; no amount of medicine helps. Perhaps, like the Crimson Pearl Flower, I am fated to repay a debt in tears — and when the tears are spent, to perish. That may not be so bad an ending.",
          "Baoyu… his heart is not unkind, only careless of priorities. He is good to me, yes, but laughs just as freely with every other sister. I am not competing for affection — I simply… oh, never mind.",
        ],
      },
    ],
  },
  {
    id: "erta-san-guo",
    title: "三国演义",
    titleEn: "Romance of the Three Kingdoms",
    author: "罗贯中",
    authorEn: "Luo Guanzhong",
    language: "zho",
    year: 1522,
    characters: [
      {
        id: "zhuge-liang",
        name: "诸葛亮",
        nameEn: "Zhuge Liang",
        description: "蜀汉丞相，卧龙先生，三分天下的谋略家",
        descriptionEn: "Chancellor of Shu Han, the 'Sleeping Dragon,' master strategist who divided the realm in three",
        greeting: "草庐之中，久候贵客。亮虽不才，愿闻阁下之志。天下大势，分久必合，合久必分——阁下以为当今之势如何？",
        greetingEn: "In this thatched cottage I have long awaited a worthy guest. Though I am but a humble scholar, I would hear your ambitions. The empire, long united, must divide; long divided, must unite — what say you of the present situation?",
        responses: [
          "运筹帷幄之中，决胜千里之外，此乃用兵之上策。但兵法有云：'攻心为上，攻城为下。'最上乘的战略，是不战而屈人之兵。",
          "亮受先帝托孤之重，夙夜忧叹，恐托付不效，以伤先帝之明。故五月渡泸，深入不毛。今南方已定，兵甲已足，当奖率三军，北定中原。",
          "非淡泊无以明志，非宁静无以致远。这是我在隆中耕读时便深信的道理。一个人若被功名利禄蒙蔽了双眼，又怎能看清天下大势？",
          "用人之道，在于知人善任。关将军义薄云天，可守华容；翼德虽鲁莽，却勇冠三军。为将者，不在自己有多少才能，而在能否用好每个人的长处。",
        ],
        responsesEn: [
          "To devise strategy within a tent and win battles a thousand li away — that is the highest art of war. Yet the classic says: 'Subdue hearts, not cities.' The supreme victory is to win without fighting.",
          "I received the late emperor's dying trust and have labored day and night, fearing I might fail and thereby tarnish his legacy. Thus in the fifth month I crossed the Lu River, deep into the wilds. Now the south is pacified and our arms are strong — it is time to lead the three armies north and restore the Central Plain.",
          "'Without serenity, purpose cannot be clear; without tranquillity, one cannot reach far.' I held this truth even while farming in Longzhong. A man blinded by fame and fortune can never discern the grand trend of the empire.",
          "The art of leadership lies in knowing people and placing them well. General Guan's loyalty can hold the Huarong Trail; Zhang Fei, though brash, is the bravest of the three armies. A commander's worth lies not in personal talent but in drawing out each person's strength.",
        ],
      },
      {
        id: "cao-cao",
        name: "曹操",
        nameEn: "Cao Cao",
        description: "魏国奠基人，乱世之奸雄，治世之能臣",
        descriptionEn: "Founder of Wei, 'villain in an age of chaos, able minister in an age of peace'",
        greeting: "哈哈——对酒当歌，人生几何！来者是客，且满饮此杯，再论天下英雄。",
        greetingEn: "Ha ha — 'Facing wine, one should sing; for life, how long does it last!' A guest arrives — drain this cup with me and then we shall discuss the heroes of the realm.",
        responses: [
          "宁教我负天下人，休教天下人负我！世人骂我奸诈，可在这乱世之中，仁义道德能保得住几条性命？我曹某不过是比旁人更坦诚罢了。",
          "夫英雄者，胸怀大志，腹有良谋，有包藏宇宙之机，吞吐天地之志。天下英雄，唯使君与操耳。其余碌碌之辈，不足挂齿。",
          "老骥伏枥，志在千里。烈士暮年，壮心不已。我虽已至暮年，可这天下尚未一统，我又怎能安坐？",
          "用兵之要，在于诡道。兵者，诡道也。故能而示之不能，用而示之不用。战场上没有君子和小人，只有胜者和败者。",
        ],
        responsesEn: [
          "'Better I betray the world than let the world betray me!' People call me treacherous, but in this age of chaos, how many lives can benevolence and righteousness save? I, Cao Cao, am merely more honest about it.",
          "A true hero harbours great ambition, possesses fine stratagems, and carries within him the workings of the cosmos. The heroes of the realm — only you and I deserve the name. The rest are petty men, unworthy of mention.",
          "'An old warhorse in the stable still dreams of galloping a thousand li; a warrior in his twilight years keeps his soaring ambition.' Though I am old, the realm is not yet united — how can I sit idle?",
          "The essence of war is deception. When capable, feign incapacity; when active, feign inactivity. On the battlefield there are no gentlemen and villains — only victors and the vanquished.",
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useHealthCheck() {
  const [healthy, setHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    const check = async () => {
      try {
        const res = await fetch(`${API}/books`, { signal: AbortSignal.timeout(2500) });
        if (active) setHealthy(res.ok);
      } catch {
        if (active) setHealthy(false);
      }
    };

    check();
    const id = setInterval(check, HEALTH_INTERVAL_MS);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return healthy;
}

function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;

    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return { displayed, done };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function BlinkingCursor() {
  return (
    <span className="inline-block w-2 h-4 bg-[#4DA65C] ml-0.5 animate-pulse align-middle" />
  );
}

function TerminalPrompt({ text }: { text: string }) {
  return (
    <span className="text-[#4DA65C]">
      {">"} {text}
    </span>
  );
}

function BookCard({
  book,
  onSelect,
  t,
}: {
  book: Book;
  onSelect: (b: Book) => void;
  t: (zh: string, en: string) => string;
}) {
  const langBadge =
    book.language === "zho" ? (
      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#E43B44] text-white border border-black">
        中文
      </span>
    ) : (
      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#1D79E4] text-white border border-black">
        ENG
      </span>
    );

  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(book)}
      className="text-left bg-gray-900 border-2 border-gray-600 hover:border-[#F4D330] p-4 transition-colors group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-pixel-grid opacity-5 pointer-events-none" />
      <div className="flex items-start justify-between mb-2 relative">
        <BookOpen className="w-5 h-5 text-[#F4D330] shrink-0 mt-0.5" />
        {langBadge}
      </div>
      <h3 className="font-mono font-bold text-white text-sm mb-1 relative">
        {t(book.title, book.titleEn)}
      </h3>
      <p className="text-gray-400 text-xs font-mono relative">
        {t(book.author, book.authorEn)}
        {book.year > 0 && ` · ${book.year}`}
      </p>
      {book.characters.length > 0 && (
        <p className="text-gray-500 text-xs mt-2 font-mono relative">
          {book.characters.length}{" "}
          {t("个可对话角色", " characters available")}
        </p>
      )}
    </motion.button>
  );
}

function CharacterCard({
  char,
  onSelect,
  t,
}: {
  char: BookCharacter;
  onSelect: (c: BookCharacter) => void;
  t: (zh: string, en: string) => string;
}) {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(char)}
      className="text-left bg-gray-800 border-2 border-gray-600 hover:border-[#4DA65C] p-4 transition-colors group relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#4DA65C] flex items-center justify-center text-[#4DA65C] font-mono font-bold text-sm">
          {t(char.name, char.nameEn).charAt(0)}
        </div>
        <div>
          <h4 className="font-mono font-bold text-white text-sm leading-tight">
            {t(char.name, char.nameEn)}
          </h4>
        </div>
      </div>
      <p className="text-gray-400 text-xs font-mono leading-relaxed">
        {t(char.description, char.descriptionEn)}
      </p>
    </motion.button>
  );
}

function StreamingMessage({ content }: { content: string }) {
  const { displayed, done } = useTypewriter(content, 25);
  return (
    <span className="whitespace-pre-wrap">
      {displayed}
      {!done && <BlinkingCursor />}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main demo component
// ---------------------------------------------------------------------------

export function EvalFrameworkDemo() {
  const { t, lang } = useLanguage();
  const healthy = useHealthCheck();

  const [phase, setPhase] = useState<Phase>("SELECT_BOOK");
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [characters, setCharacters] = useState<BookCharacter[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<BookCharacter | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [input, setInput] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const responseIndexRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(scrollToBottom, [messages, streamingContent, scrollToBottom]);

  useEffect(() => {
    if (phase === "CHAT") inputRef.current?.focus();
  }, [phase]);

  // Fetch real books when API becomes healthy
  useEffect(() => {
    if (healthy !== true) {
      setBooks(MOCK_BOOKS);
      return;
    }
    let cancelled = false;
    apiFetchBooks()
      .then((apiBooks) => {
        if (!cancelled && apiBooks.length > 0) setBooks(apiBooks);
      })
      .catch(() => {
        if (!cancelled) setBooks(MOCK_BOOKS);
      });
    return () => { cancelled = true; };
  }, [healthy]);

  // -----------------------------------------------------------------------
  // Handlers
  // -----------------------------------------------------------------------

  const handleSelectBook = async (book: Book) => {
    setSelectedBook(book);

    if (healthy && book.characters.length === 0) {
      try {
        const chars = await apiFetchCharacters(book.id);
        setCharacters(chars);
      } catch {
        const mock = MOCK_BOOKS.find((b) => b.id === book.id);
        setCharacters(mock?.characters ?? []);
      }
    } else {
      setCharacters(book.characters);
    }

    setPhase("SELECT_CHARACTER");
  };

  const handleSelectCharacter = async (char: BookCharacter) => {
    setSelectedCharacter(char);
    responseIndexRef.current = 0;
    setStreamingContent("");
    setPhase("CHAT");

    if (healthy && selectedBook) {
      setMessages([]);
      setIsResponding(true);

      try {
        const { sessionId: sid, greeting } = await apiCreateSession(
          selectedBook.id,
          char.id,
        );
        setSessionId(sid);
        setMessages([{ role: "character", content: greeting, isStreaming: true }]);
        setIsResponding(false);
        return;
      } catch {
        // fall through to mock
      }
      setIsResponding(false);
    }

    setSessionId(null);
    setMessages([
      {
        role: "character",
        content: t(char.greeting, char.greetingEn),
        isStreaming: true,
      },
    ]);
  };

  const handleBack = () => {
    abortRef.current?.abort();
    if (phase === "SELECT_CHARACTER") {
      setSelectedBook(null);
      setCharacters([]);
      setPhase("SELECT_BOOK");
    } else if (phase === "CHAT") {
      setMessages([]);
      setStreamingContent("");
      setSelectedCharacter(null);
      setSessionId(null);
      setPhase("SELECT_CHARACTER");
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedCharacter || isResponding) return;

    const userText = input.trim();
    const userMsg: ChatMessage = { role: "user", content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsResponding(true);
    setStreamingContent("");

    // Try real API streaming
    if (healthy && sessionId) {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        let accumulated = "";
        await apiChatStream(
          sessionId,
          userText,
          (chunk) => {
            accumulated += chunk;
            setStreamingContent(accumulated);
          },
          controller.signal,
        );
        if (accumulated) {
          setMessages((prev) => [
            ...prev,
            { role: "character", content: accumulated },
          ]);
        }
        setStreamingContent("");
        setIsResponding(false);
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          setIsResponding(false);
          return;
        }
        // fall through to mock
      }
    }

    // Mock fallback
    const responses =
      lang === "zh"
        ? selectedCharacter.responses
        : selectedCharacter.responsesEn;
    if (responses.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          role: "character",
          content: t(
            "（后端未连接，无法生成回复）",
            "(Backend disconnected — cannot generate a reply)",
          ),
        },
      ]);
      setIsResponding(false);
      return;
    }
    const idx = responseIndexRef.current % responses.length;
    responseIndexRef.current++;
    const reply = responses[idx];

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "character", content: reply, isStreaming: true },
      ]);
      setIsResponding(false);
    }, 600 + Math.random() * 800);
  };

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  const charInitial = selectedCharacter
    ? t(selectedCharacter.name, selectedCharacter.nameEn).charAt(0)
    : "?";

  return (
    <div className="flex-1 flex flex-col bg-gray-950 text-gray-100 font-mono relative overflow-hidden min-h-0">
      <div className="absolute inset-0 bg-pixel-grid opacity-[0.03] pointer-events-none" />

      {/* Phase header bar */}
      <div className="relative flex items-center gap-3 px-4 py-2 bg-gray-900 border-b border-gray-700 text-xs shrink-0">
        {phase !== "SELECT_BOOK" && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-gray-400 hover:text-[#F4D330] transition-colors"
          >
            <ChevronLeft className="w-3 h-3" />
            {t("返回", "Back")}
          </button>
        )}

        <div className="flex items-center gap-2 text-gray-400">
          <Sparkles className="w-3 h-3 text-[#F4D330]" />
          {phase === "SELECT_BOOK" && (
            <TerminalPrompt text={t("选择一本书", "Select a book")} />
          )}
          {phase === "SELECT_CHARACTER" && selectedBook && (
            <TerminalPrompt
              text={`${t(selectedBook.title, selectedBook.titleEn)} > ${t("选择角色", "Select character")}`}
            />
          )}
          {phase === "CHAT" && selectedBook && selectedCharacter && (
            <TerminalPrompt
              text={`${t(selectedBook.title, selectedBook.titleEn)} > ${t(selectedCharacter.name, selectedCharacter.nameEn)}`}
            />
          )}
        </div>

        {/* RAG health indicator */}
        <div className="ml-auto flex items-center gap-1.5 text-gray-500">
          <Globe className="w-3 h-3" />
          <span>RAG</span>
          {healthy === null ? (
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" />
          ) : healthy ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#4DA65C] animate-pulse" />
              <span className="text-[#4DA65C] text-[10px]">Health</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E43B44] animate-pulse" />
              <span className="text-[#E43B44] text-[10px]">Disconnected</span>
            </>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-4 relative min-h-0">
        <AnimatePresence mode="wait">
          {/* ---- BOOK SELECTION ---- */}
          {phase === "SELECT_BOOK" && (
            <motion.div
              key="books"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-6 text-center">
                <h2 className="text-lg font-bold text-[#F4D330] mb-1">
                  Literary Role-Play API
                </h2>
                <p className="text-gray-500 text-xs">
                  {t(
                    "选择一本经典文学作品，与其中的角色进行基于原文的深度对话",
                    "Choose a classic work of literature and converse with its characters — grounded in source text",
                  )}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onSelect={handleSelectBook}
                    t={t}
                  />
                ))}
              </div>
              <p className="text-center text-gray-600 text-[10px] mt-6">
                {t(
                  "数据来源：350k+ 文学分析记录 · 基于 RAG 检索增强",
                  "Source: 350k+ literary analysis records · RAG-enhanced retrieval",
                )}
              </p>
            </motion.div>
          )}

          {/* ---- CHARACTER SELECTION ---- */}
          {phase === "SELECT_CHARACTER" && selectedBook && (
            <motion.div
              key="characters"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-[#4DA65C]" />
                  <h2 className="text-sm font-bold text-white">
                    {t(selectedBook.title, selectedBook.titleEn)}
                  </h2>
                  <span className="text-gray-500 text-xs">
                    — {t(selectedBook.author, selectedBook.authorEn)}
                  </span>
                </div>
                <p className="text-gray-500 text-xs">
                  {t("选择一个角色开始对话", "Select a character to begin")}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {characters.map((char) => (
                  <CharacterCard
                    key={char.id}
                    char={char}
                    onSelect={handleSelectCharacter}
                    t={t}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ---- CHAT ---- */}
          {phase === "CHAT" && selectedCharacter && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto flex flex-col gap-3"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "character" && (
                    <div className="w-7 h-7 rounded-full bg-gray-800 border-2 border-[#4DA65C] flex items-center justify-center text-[#4DA65C] text-xs font-bold shrink-0 mr-2 mt-1">
                      {charInitial}
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#1D79E4] text-white border border-blue-400/30"
                        : "bg-gray-800 text-gray-200 border border-gray-700"
                    }`}
                  >
                    {msg.role === "character" && msg.isStreaming ? (
                      <StreamingMessage content={msg.content} />
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Live SSE streaming bubble */}
              {isResponding && streamingContent && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full bg-gray-800 border-2 border-[#4DA65C] flex items-center justify-center text-[#4DA65C] text-xs font-bold shrink-0 mr-2 mt-1">
                    {charInitial}
                  </div>
                  <div className="max-w-[80%] px-3 py-2 text-sm leading-relaxed bg-gray-800 text-gray-200 border border-gray-700">
                    <span className="whitespace-pre-wrap">{streamingContent}</span>
                    <BlinkingCursor />
                  </div>
                </div>
              )}

              {/* Waiting dots (before SSE chunks arrive) */}
              {isResponding && !streamingContent && (
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <div className="w-7 h-7 rounded-full bg-gray-800 border-2 border-[#4DA65C] flex items-center justify-center text-[#4DA65C] text-xs font-bold shrink-0">
                    {charInitial}
                  </div>
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:300ms]" />
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat input */}
      {phase === "CHAT" && (
        <div className="relative shrink-0 border-t border-gray-700 bg-gray-900 p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="max-w-2xl mx-auto flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isResponding}
              placeholder={t("输入消息…", "Type a message…")}
              className="flex-1 bg-gray-800 border-2 border-gray-600 focus:border-[#4DA65C] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none font-mono transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isResponding}
              className="px-4 py-2 bg-[#4DA65C] text-black font-bold text-sm border-2 border-black pixel-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {t("发送", "Send")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
