import { useAppState } from '#/store';
import { SLIPPI_RANKS } from '#/utils/getPlayerRankName';
import { Badge, Spinner } from '@inkjs/ui';
import { Box, Spacer, Text } from 'ink';
import Link from 'ink-link';

interface Props {
  key: string;
  userId: string;
}

function getNormalizedDisplayName(displayName: string) {
  if (displayName.length > 16) {
    return displayName.slice(0, 16) + '... ';
  }
  return displayName.padEnd(20);
}

function getRankColor(rankName?: string) {
  const rank = SLIPPI_RANKS.find((rank) => rank.name === rankName);
  return rank?.color;
}

export function Player(props: Props) {
  const player = useAppState((state) => state.playersById[props.userId]);

  const profileUrl = `https://slippi.gg/user/${player?.connectCode?.replace('#', '-').toLowerCase()}`;

  let displayName = player?.displayName || player?.connectCode || '';
  displayName = getNormalizedDisplayName(displayName);

  const rating = player?.rankedProfile?.ratingOrdinal ? Math.round(player?.rankedProfile?.ratingOrdinal) : '';

  return (
    <Box gap={3}>
      <Text>{displayName}</Text>
      {player?.isFetchingRankedData ? (
        <Spinner />
      ) : (
        <Box gap={1}>
          <Badge color={getRankColor(player?.rankedProfile?.rankName)}>{player?.rankedProfile?.rankName}</Badge>
          <Text italic>{rating}</Text>
        </Box>
      )}
      <Spacer />
      <Link url={profileUrl}>
        <Text>View Profile</Text>
      </Link>
    </Box>
  );
}
