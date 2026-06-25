{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };
  outputs = {nixpkgs, ...}: let
    systems = ["x86_64-linux" "aarch64-darwin"];
    for = f:
      nixpkgs.lib.genAttrs systems (
        system: f (import nixpkgs {inherit system;})
      );

    deps = pkgs:
      with pkgs; [
        bun
        nodejs-slim_25
      ];
    fonts = pkgs:
      with pkgs; [
        udev-gothic
      ];
  in {
    devShells = for (pkgs: {
      default = pkgs.mkShell {
        buildInputs = deps pkgs;
        shellHook = ''
          export TYPST_FONT_PATHS="${builtins.concatStringsSep ":" (map (font: "${font}/share/fonts") (fonts pkgs))}"
        '';
      };
    });
  };
}
