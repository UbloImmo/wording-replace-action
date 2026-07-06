export type Args = {
  /**
   * Path to the input PO catalog file
   *
   * @default "../input/messages.po"
   */
  input?: string;
  /**
   * Path to the output replaced PO catalog file
   *
   * @default "../output/messages.po"
   */
  output?: string;
  /**
   * Path to the JSON file containing aliases to use when replacing input wordings.
   *
   * @default "../input/aliases.json"
   */
  aliases?: string;
  /**
   * Whether to display log & debug messages in the console
   *
   * @default false
   */
  verbose?: boolean;
  /**
   * Where to write output log file
   *
   * @default "../output/log.txt"
   */
  logTo?: string;
};

export type RuntimeArgs = Required<Args>;
