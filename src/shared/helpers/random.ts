import ShortUniqueId from "short-unique-id";

export const randomPhoneNumber = (): string => {
  const prefixes = ["70", "80", "81", "90", "91"];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  let randomNumber = "";

  for (let i = 0; i < 7; i++) {
    randomNumber += Math.floor(Math.random() * 10).toString();
  }

  return `+234${randomPrefix}${randomNumber}`;
};

export const randomState = (): string => {
  const states = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "FCT (Federal Capital Territory)",
  ];

  const randomIndex = Math.floor(Math.random() * states.length);
  return states[randomIndex];
};

export const randomToken = (): string => {
  const uid = new ShortUniqueId();
  const generate = uid.randomUUID(64);
  return generate;
};

export const randomPassword = (): string => {
  const uid = new ShortUniqueId();
  const generate = uid.randomUUID(8);
  return generate;
};

export const randomStudentId = (): string => {
  const uid = new ShortUniqueId({ dictionary: "alphanum_upper" });
  const generate = uid.randomUUID(8);
  return generate;
};

export const randomProgrammeId = (): string => {
  const uid = new ShortUniqueId({ dictionary: "alphanum_upper" });
  const generate = uid.randomUUID(12);
  return generate;
};

export const randomReceiptId = (): string => {
  const uid = new ShortUniqueId({ dictionary: "alphanum_upper" });
  const generate = uid.randomUUID(12);
  return generate;
};

export const randomTransactionReference = (): string => {
  const uid = new ShortUniqueId({ dictionary: "alphanum_upper" });
  const generate = uid.randomUUID(16);
  return generate;
};
