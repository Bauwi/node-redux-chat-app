const expect = require("expect");
const { isRealString } = require("./validation");

describe("isRealString", () => {
  it("should reject non-string values", () => {
    const res = isRealString(1232455);
    expect(res).toBeFalsy();
  });

  it("should reject string with only spaces", () => {
    const res = isRealString("     ");
    expect(res).toBeFalsy();
  });

  it("should allow string with non-space-characters", () => {
    const res = isRealString("il etait une fois");
    expect(res).toBe(true);
  });
});
