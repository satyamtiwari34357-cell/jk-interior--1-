import assert from "node:assert/strict";
import test from "node:test";
import { assertPublishableProject } from "../src/lib/data/projectsRepository.ts";

const verifiedImage = { source: "JK_INTERIOR", isConcept: false };

test("allows a published project with verified studio photography", () => {
  assert.doesNotThrow(() =>
    assertPublishableProject({
      status: "PUBLISHED",
      isConcept: false,
      images: [verifiedImage],
    }),
  );
});

test("rejects empty, concept, and external image galleries for publication", () => {
  for (const images of [
    [],
    [{ source: "CONCEPT", isConcept: true }],
    [{ source: "INSPIRATION", isConcept: true }],
    [{ source: "JK_INTERIOR", isConcept: true }],
  ]) {
    assert.throws(() =>
      assertPublishableProject({ status: "PUBLISHED", isConcept: false, images }),
    );
  }
});

test("permits draft concept content", () => {
  assert.doesNotThrow(() =>
    assertPublishableProject({
      status: "DRAFT",
      isConcept: true,
      images: [{ source: "CONCEPT", isConcept: true }],
    }),
  );
});
