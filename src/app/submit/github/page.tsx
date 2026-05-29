import { redirect } from "next/navigation";

export default function LegacyGithubSubmitPage() {
  redirect("/submissions/upload");
}
