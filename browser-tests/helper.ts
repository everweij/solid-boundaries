import { ROOT_ID } from "@cypress/mount-utils";
import { createEffect, onCleanup } from "solid-js";
import { render as _render } from "solid-js/web";
import type { Accessor, JSXElement } from "solid-js";
import type { Bounds } from "../src/bounds";
import { allKeys, boundsFromElement } from "../src/bounds";

export let unmount: null | (() => void) = null;

export function render(code: () => JSXElement) {
  const _unmount = _render(code, document.getElementById(ROOT_ID)!);

  unmount = () => {
    _unmount();
    unmount = null;
  };

  return unmount;
}

const boundsMap: Map<string, Bounds | null> = new Map();

export function storeBounds(id: string, bounds: Accessor<Bounds | null>) {
  createEffect(() => {
    boundsMap.set(id, bounds());
  });
  onCleanup(() => boundsMap.delete(id));
}

function isSet<T>(value: T | null | undefined): value is T {
  return value === null || value === undefined ? false : true;
}

const MAX_RETRIES = 4;

export function checkBounds(description?: string) {
  cy.log(`Checking bounds ${description}`);
  for (const id of boundsMap.keys()) {
    cy.get(`#${id}`).then(subject => {
      return new Cypress.Promise((resolve, reject) => {
        let attempt = 0;
        const actualBounds = boundsFromElement(subject[0]);

        function check() {
          attempt++;
          const trackedBounds = boundsMap.get(id);

          const boundsAreEqual =
            isSet(trackedBounds) &&
            isSet(actualBounds) &&
            allKeys.every(key => actualBounds[key] === trackedBounds[key]);

          if (boundsAreEqual) {
            resolve();
            return;
          }

          if (attempt <= MAX_RETRIES) {
            const frame = 1000 / 60;
            setTimeout(check, frame);
            return;
          }

          reject(
            new Error(
              `Bounds mismatch on id ${id}.${
                description ? `\nDescription: "${description}"` : ""
              }\nExpected:\n${JSON.stringify(
                trackedBounds
              )}\nActual:\n${JSON.stringify(actualBounds)}`
            )
          );
        }

        check();
      });
    });
  }
}
