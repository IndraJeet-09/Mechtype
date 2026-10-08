import { JSXElement } from "solid-js";

import { showModal } from "../../../states/modals";
import { Button } from "../../common/Button";

export function TestConfigMobile(): JSXElement {
  return (
    <Button
      class="sticky top-3 z-10 mx-auto mb-10 flex w-max rounded-full border border-text/10 px-4 py-2 font-semibold text-sub shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] md:hidden"
      variant="button"
      onClick={() => {
        showModal("MobileTestConfig");
      }}
      text="test settings"
      fa={{
        icon: "fa-cog",
      }}
    />
  );
}
