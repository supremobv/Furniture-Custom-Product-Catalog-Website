import { requireChatGPTUser } from "../chatgpt-auth";
import Inbox from "./inbox";
export const dynamic = "force-dynamic";
export default async function Studio() {
  await requireChatGPTUser("/studio");
  return <Inbox />;
}
