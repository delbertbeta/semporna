export function getInitialModalEntered(visible: boolean) {
  return Boolean(visible);
}

export function getRealModalLoading({
  entered,
  loading,
}: {
  entered: boolean;
  loading?: boolean;
}) {
  return !entered || Boolean(loading);
}
