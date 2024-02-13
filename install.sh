#!/bin/sh

set -e

log() {
  echo "$1"
}

repo="SampaioLeal/butiko" 
os_arch="linux_amd64"
latest_release=$(curl -sL "https://api.github.com/repos/${repo}/releases/latest" | jq -r '.tag_name')
asset_url="https://github.com/SampaioLeal/butiko/releases/download/${latest_release}/butiko_${latest_release}_${os_arch}.xz"
install_path="/usr/local/bin"
exe="$install_path/butiko"

if ! command -v xz >/dev/null; then
	log "Error: xz is required to install Butiko." 1>&2
	exit 1
fi

curl --fail --location --progress-bar --output "${exe}.xz" "$asset_url"

xz -d "$exe.xz"
chmod +x "$exe"

log "Butiko was installed successfully to $exe"

if command -v butiko >/dev/null; then
	log "Run 'butiko --help' to get started"
else
	case $SHELL in
	/bin/zsh) shell_profile=".zshrc" ;;
	*) shell_profile=".bashrc" ;;
	esac
	log "Manually add the directory to your \$HOME/$shell_profile (or similar)"
	log "  export PATH=\"/usr/local/bin:\$PATH\""
	log "Run '$exe --help' to get started"
fi

