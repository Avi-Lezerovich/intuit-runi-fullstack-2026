import type {
  AuthResponse,
  Post,
  Sort,
  User,
  UserListItem,
  UserProfileResponse,
  VoteResponse,
  VoteSide,
} from "./types";

type StoredUser = User & { password: string };

type MockVote = {
  post_id: number;
  user_id: number;
  side: VoteSide;
};

type MockState = {
  users: StoredUser[];
  posts: Post[];
  votes: MockVote[];
  nextUserId: number;
  nextPostId: number;
};

const STORAGE_KEY = "suit_for_fun_mock_state_v1";

const now = Date.now();
const hoursAgo = (hours: number): string => new Date(now - hours * 3_600_000).toISOString();
const daysAgo = (days: number): string => new Date(now - days * 86_400_000).toISOString();

const createDefaultState = (): MockState => {
  const users: StoredUser[] = [
    { id: 1, name: "דנה כהן", email: "dana@example.com", password: "demo123", created_at: daysAgo(30) },
    { id: 2, name: "יואב לוי", email: "yoav@example.com", password: "demo123", created_at: daysAgo(29) },
    { id: 3, name: "מאיה שטרן", email: "maya@example.com", password: "demo123", created_at: daysAgo(28) },
    { id: 4, name: "איתי אברמוב", email: "itay@example.com", password: "demo123", created_at: daysAgo(27) },
    { id: 5, name: "רוני גולן", email: "roni@example.com", password: "demo123", created_at: daysAgo(26) },
    { id: 6, name: "נועה פרידמן", email: "noa@example.com", password: "demo123", created_at: daysAgo(25) },
    { id: 7, name: "אלון ברק", email: "alon@example.com", password: "demo123", created_at: daysAgo(24) },
    { id: 8, name: "מיכל שלו", email: "michal@example.com", password: "demo123", created_at: daysAgo(23) },
    { id: 9, name: "תומר אזולאי", email: "tomer@example.com", password: "demo123", created_at: daysAgo(22) },
    { id: 10, name: "עדי בלום", email: "adi@example.com", password: "demo123", created_at: daysAgo(21) },
    { id: 11, name: "גיא מזרחי", email: "guy@example.com", password: "demo123", created_at: daysAgo(20) },
    { id: 12, name: "ליהי שדה", email: "lihi@example.com", password: "demo123", created_at: daysAgo(19) },
  ];

  const posts: Post[] = [
    {
      id: 1,
      title: "הכלב שסירב לזוז מהספה",
      body: "הוריתי בנימוס לנתבע לפנות את הספה. הוא הביט בי, נאנח, וסירב להזיז גף אחד. נאלצתי לישון בכורסה הקטנה כמו פליט בביתי שלי.",
      defendant: "קוקי הגולדן",
      location: "סלון, דירה 4 קומה ב",
      charges: ["רשלנות פלילית", "עיכוב כרוני"],
      damages: "התנצלות פומבית + זכות בלעדית על הספה ליום אחד",
      author_id: 1,
      author_name: "דנה כהן",
      guilty_votes: 142,
      innocent_votes: 28,
      created_at: hoursAgo(2),
    },
    {
      id: 2,
      title: "החבר שביטל יום לפני הטיול",
      body: "הזמנו צימר. שילמנו מקדמה. תכננתי ארבעה חודשים. יום לפני הוא כתב שהוא נשאר בבית. תובע פיצוי על נזק נפשי, אובדן חופשה ועלבון אישי.",
      defendant: "דניאל מ.",
      location: "WhatsApp, 23:14",
      charges: ["בגידה חברתית", "הפרת שלוות נפש", "מניפולציה רגשית"],
      damages: "תשלום מלוא הצימר + ארוחת ערב כבקשתי",
      author_id: 2,
      author_name: "יואב לוי",
      guilty_votes: 287,
      innocent_votes: 45,
      created_at: hoursAgo(5),
    },
    {
      id: 3,
      title: "השכן שמנגן גיטרה בחצות",
      body: "בכל לילה ב-23:58 הוא מנגן את אותם ארבעה אקורדים של Wonderwall. לא מסיים את השיר. רק האינטרו. אני שומע אותו גם בחלומות.",
      defendant: "השכן מקומה 3",
      location: "בניין ברחוב הירקון, תל אביב",
      charges: ["הפרת שלוות נפש", "ייאוש מכוון"],
      damages: "איסור עולם על נגינת Oasis בכל מקום",
      author_id: 3,
      author_name: "מאיה שטרן",
      guilty_votes: 512,
      innocent_votes: 87,
      created_at: daysAgo(1),
    },
    {
      id: 4,
      title: "הברמן ששפך עליי קפה ולא התנצל",
      body: "הזמנתי קפוצ'ינו. הברמן החליק, שפך חצי עליי, אמר 'טוב נו' וחזר לבר. החולצה הלבנה החדשה שלי הפכה למפת גלקסיה חומה.",
      defendant: "הברמן עם הקוקו",
      location: "בית קפה ברחוב דיזנגוף",
      charges: ["רשלנות פלילית", "מניפולציה רגשית"],
      damages: "קפה חינם לכל החיים + חולצה חדשה",
      author_id: 4,
      author_name: "איתי אברמוב",
      guilty_votes: 198,
      innocent_votes: 76,
      created_at: hoursAgo(27),
    },
    {
      id: 5,
      title: "האחות הקטנה שגנבה את הטעינה",
      body: "המטען נשאר בחדרי לבטח, מחובר לשקע. בשובי מהמקלחת הוא נעלם. הנתבעת שיחקה ב-Roblox כאילו לא קרה דבר.",
      defendant: "נועה (אחותי)",
      location: "הבית, חדר ילדים",
      charges: ["בגידה חברתית", "רשלנות פלילית"],
      damages: "החזרת המטען + 50 שח דמי טיפול",
      author_id: 1,
      author_name: "דנה כהן",
      guilty_votes: 89,
      innocent_votes: 134,
      created_at: daysAgo(2),
    },
    {
      id: 6,
      title: "הנהג שעצר באמצע הצומת",
      body: "אור ירוק. הוא עצר. באמצע הצומת. מאחוריו משטרה ו-30 רכבים. בעיני זו הייתה הפעם הראשונה שפגשתי עיכוב כרוני אמיתי.",
      defendant: "הסובארו הכחולה",
      location: "צומת אחרי קיבוץ יקום",
      charges: ["עיכוב כרוני", "רשלנות פלילית"],
      damages: "ביטול רישיון הנהיגה לתקופה לא מוגדרת",
      author_id: 5,
      author_name: "רוני גולן",
      guilty_votes: 321,
      innocent_votes: 12,
      created_at: daysAgo(3),
    },
    {
      id: 7,
      title: "המסעדה שאיבדה את ההזמנה שלי",
      body: "הזמנתי דרך אפליקציה. שילמתי. חיכיתי שעה. 'אופס, לא ראינו את ההזמנה'. הציעו לי 10% הנחה על הזמנה הבאה. שאני לא אזמין מהם שוב.",
      defendant: "המסעדה האסיאתית בקניון",
      location: "אפליקציית 10bis",
      charges: ["רשלנות פלילית", "בגידה חברתית", "ייאוש מכוון"],
      damages: "החזר מלא + פיצוי בפיצה",
      author_id: 2,
      author_name: "יואב לוי",
      guilty_votes: 245,
      innocent_votes: 31,
      created_at: daysAgo(4),
    },
    {
      id: 8,
      title: "האקס שעוקב אחרי בכל פלטפורמה",
      body: "נפרד ממני לפני שנתיים. עוקב אחריי באינסטה, בלינקדאין, בטיקטוק ובפינטרסט. רואה כל story תוך ארבע דקות. אני יודעת שהוא קורא את זה.",
      defendant: "האקס",
      location: "כל הפלטפורמות",
      charges: ["הפרת שלוות נפש", "מניפולציה רגשית"],
      damages: "איסור עולמי על שימוש באינטרנט",
      author_id: 3,
      author_name: "מאיה שטרן",
      guilty_votes: 678,
      innocent_votes: 23,
      created_at: daysAgo(5),
    },
    {
      id: 9,
      title: "האב שצופה בטלפון בארוחה משפחתית",
      body: "יום שישי. כל המשפחה. אבא מסתכל בטלפון כל 30 שניות. כשהוא אומר 'סיימתי' הוא כבר חוזר לגלול. אחר כך הוא נואם על 'הדור הזה'.",
      defendant: "אבא",
      location: "שולחן שבת",
      charges: ["בגידה חברתית", "מניפולציה רגשית"],
      damages: "החרמת הטלפון בכל ארוחה לשנה הקרובה",
      author_id: 4,
      author_name: "איתי אברמוב",
      guilty_votes: 423,
      innocent_votes: 89,
      created_at: daysAgo(6),
    },
    {
      id: 10,
      title: "הקופאית בסופר שלא רצתה לפתוח עוד קופה",
      body: "תור של 12 אנשים. ביקשתי שיפתחו עוד קופה. 'זה לא התפקיד שלי' אמרה. 'אני בהפסקה' השיבה, תוך כדי שהיא אוכלת קרם בוה על חשבון העמדה.",
      defendant: "הקופאית עם הציפורניים",
      location: "סופר ברחוב אבן גבירול",
      charges: ["רשלנות פלילית", "עיכוב כרוני"],
      damages: "הסבה מקצועית לתחום שאינו מצריך אנשים",
      author_id: 5,
      author_name: "רוני גולן",
      guilty_votes: 156,
      innocent_votes: 187,
      created_at: daysAgo(7),
    },
    {
      id: 11,
      title: "המאמן בכושר שצועק 'עוד אחד' 17 פעמים",
      body: "הוא אמר 'עוד אחד אחרון'. עשיתי. הוא אמר שוב. ושוב. ושוב. עד שלא יכולתי להרים את הזרוע לסבון אחר כך. הזרוע שלי עדיין רועדת.",
      defendant: "יוסי המאמן",
      location: "חדר כושר, רחוב אלנבי",
      charges: ["מניפולציה רגשית", "ייאוש מכוון", "רשלנות פלילית"],
      damages: "יום של עיסוי שבדי על חשבונו",
      author_id: 6,
      author_name: "נועה פרידמן",
      guilty_votes: 234,
      innocent_votes: 156,
      created_at: daysAgo(8),
    },
    {
      id: 12,
      title: "המתכנת שכתב TODO ועזב את החברה",
      body: "במערכת שקיבלתי ירשתי 847 הערות TODO. עזב לפני 3 שנים. אחת מהן אומרת 'צריך לתקן את כל המערכת'. מאז אני חי עם השאלה הזאת.",
      defendant: "דני, מתכנת לשעבר",
      location: "GitHub, ענף main",
      charges: ["בגידה חברתית", "עיכוב כרוני", "ייאוש מכוון"],
      damages: "יום שלם של תיקון באגים שלו",
      author_id: 7,
      author_name: "אלון ברק",
      guilty_votes: 891,
      innocent_votes: 14,
      created_at: daysAgo(10),
    },
  ];

  return {
    users,
    posts,
    votes: [],
    nextUserId: users.length + 1,
    nextPostId: posts.length + 1,
  };
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const loadState = (): MockState => {
  if (typeof localStorage === "undefined") return createDefaultState();

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createDefaultState();

  try {
    const parsed = JSON.parse(raw) as MockState;
    if (!parsed || !Array.isArray(parsed.users) || !Array.isArray(parsed.posts) || !Array.isArray(parsed.votes)) {
      return createDefaultState();
    }
    return parsed;
  } catch {
    return createDefaultState();
  }
};

let state = loadState();

const persistState = (): void => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const userById = (userId: number): StoredUser | undefined => state.users.find((user) => user.id === userId);
const postById = (postId: number): Post | undefined => state.posts.find((post) => post.id === postId);

const publicUser = (user: StoredUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  created_at: user.created_at,
});

const authorNameFor = (authorId: number): string => userById(authorId)?.name ?? "תובע אנונימי";

const normalize = (value: string): string => value.trim().toLowerCase();

const sortedPosts = (sort: Sort): Post[] => {
  const posts = state.posts.map((post) => ({ ...post }));

  posts.sort((left, right) => {
    const leftCreated = new Date(left.created_at).getTime();
    const rightCreated = new Date(right.created_at).getTime();
    const leftTotal = left.guilty_votes + left.innocent_votes;
    const rightTotal = right.guilty_votes + right.innocent_votes;

    if (sort === "new") return rightCreated - leftCreated;
    if (sort === "closed") {
      if (rightTotal !== leftTotal) return rightTotal - leftTotal;
      return rightCreated - leftCreated;
    }

    const leftHot = leftTotal * 10_000 - (Date.now() - leftCreated) / 3_600_000;
    const rightHot = rightTotal * 10_000 - (Date.now() - rightCreated) / 3_600_000;
    if (rightHot !== leftHot) return rightHot - leftHot;
    return rightCreated - leftCreated;
  });

  return posts;
};

const paged = <T,>(items: T[], limit?: number, offset?: number): T[] => {
  const start = typeof offset === "number" ? offset : 0;
  const end = typeof limit === "number" ? start + limit : undefined;
  return items.slice(start, end);
};

const withAuthorNames = (posts: Post[]): Post[] => {
  return posts.map((post) => ({
    ...post,
    author_name: authorNameFor(post.author_id),
    charges: post.charges ? [...post.charges] : undefined,
  }));
};

const readSessionUser = (): User | null => {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

const requireSessionUser = (): StoredUser => {
  const sessionUser = readSessionUser();
  if (!sessionUser) throw new Error("נדרשת התחברות");
  const user = userById(sessionUser.id);
  if (!user) throw new Error("המשתמש המחובר לא קיים במאגר ההדגמה");
  return user;
};

const ensureUniqueEmail = (email: string): void => {
  if (state.users.some((user) => user.email.toLowerCase() === email.trim().toLowerCase())) {
    throw new Error("האימייל כבר רשום במערכת");
  }
};

const buildAuthResponse = (user: StoredUser): AuthResponse => ({
  token: `mock-token-${user.id}`,
  user: publicUser(user),
});

export const mockLogin = async (email: string, password: string): Promise<AuthResponse> => {
  const user = state.users.find((candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || user.password !== password) throw new Error("אימייל או סיסמה שגויים");
  return buildAuthResponse(user);
};

export const mockSignup = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  ensureUniqueEmail(email);
  const created: StoredUser = {
    id: state.nextUserId++,
    name: name.trim(),
    email: email.trim(),
    password,
    created_at: new Date().toISOString(),
  };
  state.users.push(created);
  persistState();
  return buildAuthResponse(created);
};

export const mockFetchPosts = async (opts: { sort?: Sort; limit?: number; offset?: number } = {}): Promise<Post[]> => {
  const posts = withAuthorNames(sortedPosts(opts.sort ?? "hot"));
  return clone(paged(posts, opts.limit, opts.offset));
};

export const mockFetchPost = async (id: number): Promise<Post> => {
  const post = postById(id);
  if (!post) throw new Error("התביעה לא נמצאה");
  return clone({ ...post, author_name: authorNameFor(post.author_id) });
};

export const mockCreatePost = async (payload: {
  title: string;
  body: string;
  defendant: string;
  location?: string;
  charges?: string[];
  damages?: string;
}): Promise<Post> => {
  const user = requireSessionUser();
  const post: Post = {
    id: state.nextPostId++,
    title: payload.title,
    body: payload.body,
    defendant: payload.defendant,
    location: payload.location ?? null,
    charges: payload.charges && payload.charges.length > 0 ? [...payload.charges] : undefined,
    damages: payload.damages ?? null,
    author_id: user.id,
    author_name: user.name,
    guilty_votes: 0,
    innocent_votes: 0,
    created_at: new Date().toISOString(),
  };
  state.posts.unshift(post);
  persistState();
  return clone(post);
};

export const mockDeletePost = async (id: number): Promise<{ deleted: number }> => {
  const user = requireSessionUser();
  const post = postById(id);
  if (!post) return { deleted: 0 };
  if (post.author_id !== user.id) throw new Error("אין הרשאה למחוק תביעה זו");

  state.posts = state.posts.filter((item) => item.id !== id);
  state.votes = state.votes.filter((vote) => vote.post_id !== id);
  persistState();
  return { deleted: 1 };
};

export const mockVotePost = async (id: number, side: VoteSide): Promise<VoteResponse> => {
  const user = requireSessionUser();
  const post = postById(id);
  if (!post) throw new Error("התביעה לא נמצאה");
  if (post.author_id === user.id) throw new Error("לא ניתן להצביע על תביעה שלך");

  const existingIndex = state.votes.findIndex((vote) => vote.post_id === id && vote.user_id === user.id);
  const previousSide = existingIndex >= 0 ? state.votes[existingIndex].side : null;

  if (existingIndex >= 0) {
    state.votes[existingIndex] = { post_id: id, user_id: user.id, side };
  } else {
    state.votes.push({ post_id: id, user_id: user.id, side });
  }

  if (previousSide && previousSide !== side) {
    post[previousSide === "guilty" ? "guilty_votes" : "innocent_votes"] -= 1;
    post[side === "guilty" ? "guilty_votes" : "innocent_votes"] += 1;
  } else if (!previousSide) {
    post[side === "guilty" ? "guilty_votes" : "innocent_votes"] += 1;
  }

  persistState();

  return {
    post_id: id,
    side,
    guilty_votes: post.guilty_votes,
    innocent_votes: post.innocent_votes,
  };
};

export const mockFetchUsers = async (opts: { search?: string; limit?: number; offset?: number } = {}): Promise<UserListItem[]> => {
  const search = normalize(opts.search || "");

  const items = state.users
    .map((user) => {
      const authored = state.posts.filter((post) => post.author_id === user.id);
      const guilty = authored.filter((post) => post.guilty_votes > post.innocent_votes).length;
      const total = authored.length;
      return {
        ...publicUser(user),
        post_count: total,
        guilty_count: guilty,
        guilty_percent: total ? Math.round((guilty / total) * 100) : 0,
      } satisfies UserListItem;
    })
    .filter((item) => {
      if (!search) return true;
      return normalize(item.name).includes(search) || normalize(item.email).includes(search);
    })
    .sort((left, right) => {
      if (right.post_count !== left.post_count) return right.post_count - left.post_count;
      return left.name.localeCompare(right.name, "he");
    });

  return clone(paged(items, opts.limit, opts.offset));
};

export const mockFetchUserProfile = async (id: number): Promise<UserProfileResponse> => {
  const user = userById(id);
  if (!user) throw new Error("התובע לא נמצא");

  const posts = withAuthorNames(
    state.posts
      .filter((post) => post.author_id === id)
      .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime()),
  );
  const guilty = posts.filter((post) => post.guilty_votes > post.innocent_votes).length;
  const total = posts.length;

  return clone({
    user: publicUser(user),
    stats: {
      total,
      guilty,
      innocent: total - guilty,
      success_percent: total ? Math.round((guilty / total) * 100) : 0,
    },
    posts,
  });
};
