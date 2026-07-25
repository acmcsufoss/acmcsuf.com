import { Term } from '../types';
import type { Officer } from '../types';
import { getMembers } from '../utils';

/**
 * This file was made to assist the teams page. You can find it
 * at src/routes/\(site\)/teams
 */

/**
 * IDs of teams that are always shown regardless of whether they have members
 * in the current term.
 */
const PERMANENT_TEAM_IDS = ['general', 'icpc', 'oss'];

/**
 * Teams that are only active during specific terms. If a team is not listed
 * here, it is assumed to be active in all terms (subject to member presence
 * unless it's a permanent team).
 */
const TERM_RESTRICTED_TEAMS: Record<string, Term[]> = {
  nodebuds: [
    Term.Fall21,
    Term.Spring21,
    Term.Spring22,
    Term.Fall24,
    Term.Spring25,
    Term.Fall25,
    Term.Spring26,
    Term.Fall26,
  ],
  gamedev: [
    Term.Spring23,
    Term.Fall23,
    Term.Spring24,
    Term.Fall24,
    Term.Spring25,
    Term.Fall25,
    Term.Spring26,
  ],
};

/**
 * Determines whether a team should be visible for a given term.
 *
 * A team is hidden when:
 * - It has no members for the term AND is not a permanent team (ex: Special Events)
 * 
 * OR
 * 
 * - It has a term restriction list and the current term is not in it. (ex: Game Dev)
 */
export function isTeamVisibleForTerm(
  teamId: string,
  term: Term,
  members: Officer[],
  tiers?: number[]
): boolean {
  if (teamId in TERM_RESTRICTED_TEAMS) {
    if (!TERM_RESTRICTED_TEAMS[teamId].includes(term)) {
      return false;
    }
  }

  if (PERMANENT_TEAM_IDS.includes(teamId)) {
    return true;
  }

  const teamMembers = getMembers(members, term, tiers);
  return teamMembers.length > 0;
}
