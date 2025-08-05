import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import qs from "qs";
import { ChangeEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";

import { createPaste } from "../service";
import nanoid from "../utils/nanoid";
import Editor from "./editor";

export default function TextShare() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState("text");
  const [sharePassword, setSharePassword] = useState<string>("");
  const [content, setContent] = useState("");
  const [expiration, setExpiration] = useState<number | undefined>(undefined);
  const [isPrivate, setIsPrivate] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const createPB = async () => {
    if (!content) return toast.error("请输入内容");
    setPublishing(true);
    const data = await createPaste({
      content,
      expire: expiration,
      isPrivate,
      language,
      share_password: sharePassword,
    });
    setPublishing(false);
    navigate(
      `/detail/${data.id}${qs.stringify(
        {
          share_password: data.share_password,
        },
        { addQueryPrefix: true },
      )}`,
      {
        state: { edit_password: data.edit_password },
      },
    );
  };

  const handleSetAsPrivate = (checked: boolean) => {
    setIsPrivate(checked);
    setSharePassword(checked ? nanoid(10) : "");
  };

  const handleChangeSharePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setSharePassword(e.target.value);
  };

  return (
    <div className="space-y-4">
      <Editor
        className="rounded-md border"
        height="400px"
        language={language}
        onChange={(value) => setContent(value || "")}
        value={content}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 h-5">
            <Checkbox
              checked={isPrivate}
              onCheckedChange={handleSetAsPrivate}
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("privateTip")}
            </label>
          </div>
          <Input
            value={sharePassword}
            placeholder="Share Password"
            onChange={handleChangeSharePassword}
            disabled={!isPrivate}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 h-5 flex items-center">
            {t("expiration")}
          </label>
          <Select
            value={expiration?.toString()}
            onValueChange={(value) => setExpiration(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("expiration")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="60">1 min</SelectItem>
              <SelectItem value="300">5 mins</SelectItem>
              <SelectItem value="3600">1 hour</SelectItem>
              <SelectItem value="86400">1 day</SelectItem>
              <SelectItem value="604800">1 week</SelectItem>
              <SelectItem value="2592000">1 month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 h-5 flex items-center">
            Language
          </label>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Plaintext</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="yaml">YAML</SelectItem>
              <SelectItem value="c">C/CPP</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="golang">Golang</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
              <SelectItem value="shell">Shell</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={createPB} disabled={publishing || !content}>
          {publishing ? "Creating..." : "Create Paste"}
        </Button>
      </div>
    </div>
  );
}
