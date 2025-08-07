import { useAppState } from '#/store';
import { Box, Text } from 'ink';
import Link from 'ink-link';

interface Props {
  key: string;
  connectCode: string;
}

export function Player(props: Props) {
  const player = useAppState((state) => state.playersByConnectCode[props.connectCode]);

  const profileUrl = `https://slippi.gg/user/${props.connectCode.replace('#', '-').toLowerCase()}`;

  return (
    <Box gap={3}>
      <Text>{player?.playerFromReplayFile.displayName}</Text>
      <Text>{player?.rankedProfile?.ratingOrdinal}</Text>
      <Text>{player?.rankedProfile?.rankName}</Text>
      <Link url={profileUrl}>
        <Text>View Profile</Text>
      </Link>
    </Box>
  );
}
