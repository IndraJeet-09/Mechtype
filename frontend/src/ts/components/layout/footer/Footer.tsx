import { JSXElement } from "solid-js";

import { getIsScreenshotting } from "../../../states/core";
import { getFocus } from "../../../states/test";
import { cn } from "../../../utils/cn";
import { Button } from "../../common/Button";
import { Keytips } from "./Keytips";
import { VersionButton } from "./VersionButton";

export function Footer(): JSXElement {
  return (
    <footer
      class={cn("relative text-xs text-sub", {
        "opacity-0": getIsScreenshotting(),
      })}
    >
      <Keytips />

      <div
        class="-m-2 flex justify-between gap-8 transition-opacity"
        classList={{
          "opacity-0": getFocus(),
        }}
      >
        <div class="grid grid-cols-1 justify-items-start xs:grid-cols-2 sm:grid-cols-4 lg:flex">
          <Button
            variant="text"
            text="github"
            fa={{
              icon: "fa-github",
              variant: "brand",
              fixedWidth: true,
            }}
            href="https://github.com/IndraJeet-09/Mechtype"
          />
          <Button
            variant="text"
            text="contact"
            fa={{
              icon: "fa-envelope",
              fixedWidth: true,
            }}
            href="mailto:indrajeetchouhan680@gmail.com"
          />
          <Button
            variant="text"
            text="twitter"
            fa={{
              icon: "fa-twitter",
              variant: "brand",
              fixedWidth: true,
            }}
            href="https://x.com/indrajeetdotjs"
          />
          <Button
            variant="text"
            text="terms"
            fa={{
              icon: "fa-file-contract",
              fixedWidth: true,
            }}
            href="/terms-of-service.html"
          />
          <Button
            href="/security-policy.html"
            variant="text"
            text="security"
            fa={{
              icon: "fa-shield-alt",
              fixedWidth: true,
            }}
          />
          <Button
            href="/privacy-policy.html"
            variant="text"
            text="privacy"
            fa={{
              icon: "fa-lock",
              fixedWidth: true,
            }}
          />
        </div>
        <div class="flex flex-col items-end text-right lg:flex-row">
          <VersionButton />
        </div>
      </div>
    </footer>
  );
}
