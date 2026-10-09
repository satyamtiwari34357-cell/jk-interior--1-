import assert from "node:assert/strict";
import test from "node:test";
import { leadValidationSchema } from "../src/lib/validations/lead.ts";

test("accepts the required consultation fields", () => {
  const result = leadValidationSchema.safeParse({
    name: "Example Visitor",
    phone: "0000000000",
    projectType: "Residential Interior",
    location: "Mumbai",
  });

  assert.equal(result.success, true);
});

test("rejects invalid required fields and email addresses", () => {
  const result = leadValidationSchema.safeParse({
    name: "A",
    phone: "",
    projectType: "",
    location: "",
    email: "not-an-email",
  });

  assert.equal(result.success, false);
});
